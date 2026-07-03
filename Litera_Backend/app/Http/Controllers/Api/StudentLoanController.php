<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\LoanResource;
use App\Models\Book;
use App\Models\Loan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StudentLoanController extends Controller
{
    /**
     * GET /api/student/loans
     * Menampilkan daftar semua peminjaman milik siswa yang login (Rak Buku).
     *
     * Query params:
     * - ?status=pending | approved | returned
     */
    public function index(Request $request)
    {
        $query = Loan::with(['book', 'user'])
                     ->where('school_id', auth()->user()->school_id)
                     ->where('user_id', auth()->id());

        // Filter status: ?status=pending / approved / returned
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $loans = $query->latest()->paginate($request->per_page ?? 10);

        return response()->json([
            'status' => 'success',
            'data'   => LoanResource::collection($loans->items()),
            'meta'   => [
                'current_page' => $loans->currentPage(),
                'last_page'    => $loans->lastPage(),
                'per_page'     => $loans->perPage(),
                'total'        => $loans->total(),
            ],
        ]);
    }

    /**
     * POST /api/student/loans
     * Mengajukan peminjaman buku baru oleh siswa.
     *
     * Body:
     * - book_id (required)
     */
    public function store(Request $request)
    {
        $request->validate([
            'book_id' => 'required|integer|exists:books,id',
        ]);

        $user = auth()->user();
        $book = Book::where('school_id', $user->school_id)->find($request->book_id);

        if (!$book) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Buku tidak ditemukan.',
            ], 404);
        }

        // Cek apakah siswa sudah punya peminjaman pending/approved untuk buku yang sama
        $existingLoan = Loan::where('school_id', $user->school_id)
                            ->where('user_id', $user->id)
                            ->where('book_id', $book->id)
                            ->whereIn('status', ['pending', 'approved'])
                            ->first();

        if ($existingLoan) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Anda sudah meminjam atau sedang mengajukan peminjaman buku ini.',
            ], 422);
        }

        // Buat peminjaman baru - stok akan dikurangi saat admin menyetujui
        $loanData = [
            'school_id'          => $user->school_id,
            'book_id'            => $book->id,
            'user_id'            => $user->id,
            'tanggal_jatuh_tempo'=> now()->addDays(14)->toDateString(),
            'status'             => 'pending',
        ];

        // Cek stok tersedia (untuk SEMUA jenis buku, baik fisik maupun digital)
        if ($book->jumlah_tersedia <= 0) {
            $tipeBuku = $book->pdf ? 'digital' : 'fisik';
            return response()->json([
                'status'  => 'error',
                'message' => "Maaf, stok buku {$tipeBuku} ini sedang habis.",
            ], 422);
        }

        // Untuk buku digital (PDF), auto-approve langsung tanpa menunggu admin
        if ($book->pdf) {
            $loanData['status'] = 'approved';
            $loanData['tanggal_pinjam'] = now()->toDateString();
        }

        $loan = Loan::create($loanData);

        // Jika buku digital, kurangi stok langsung
        if ($book->pdf) {
            $book->decrement('jumlah_tersedia');
            $book->increment('jumlah_pinjam');
        }

        $message = $book->pdf
            ? 'Buku digital berhasil diakses. Selamat membaca!'
            : 'Peminjaman berhasil diajukan. Menunggu persetujuan admin.';

        return response()->json([
            'status'  => 'success',
            'message' => $message,
            'data'    => new LoanResource($loan->load(['book', 'user'])),
        ], 201);
    }

    /**
     * PUT /api/student/loans/{id}/return
     * Mengembalikan buku yang sudah dipinjam (Pengembalian).
     * Hanya bisa dilakukan untuk peminjaman dengan status 'approved'.
     */
    public function returnBook($id)
    {
        $loan = Loan::with('book')
                    ->where('school_id', auth()->user()->school_id)
                    ->where('user_id', auth()->id())
                    ->find($id);

        if (!$loan) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Peminjaman tidak ditemukan.',
            ], 404);
        }

        if ($loan->status !== 'approved') {
            return response()->json([
                'status'  => 'error',
                'message' => 'Peminjaman ini tidak bisa dikembalikan. Status saat ini: ' . $loan->status,
            ], 422);
        }

        DB::transaction(function () use ($loan) {
            $book = $loan->book;

            // Update stok buku
            $book->increment('jumlah_tersedia');
            $book->decrement('jumlah_pinjam');

            // Update status peminjaman
            $loan->update([
                'status'          => 'returned',
                'tanggal_kembali' => now()->toDateString(),
            ]);

            // Hitung denda jika terlambat
            $jatuhTempo = \Carbon\Carbon::parse($loan->tanggal_jatuh_tempo);
            $hariIni = now();
            $hariTerlambat = $jatuhTempo->diffInDays($hariIni, false); // false = negative if not overdue

            if ($hariTerlambat > 0) {
                $dendaPerHari = 1000; // Rp 1.000 per hari
                $jumlahDenda = $hariTerlambat * $dendaPerHari;

                $loan->user->fines()->create([
                    'school_id'        => $loan->school_id,
                    'loan_id'          => $loan->id,
                    'jumlah_denda'     => $jumlahDenda,
                    'hari_terlambat'   => $hariTerlambat,
                    'status_denda'     => 'pending',
                    'tanggal_dikenakan'=> now()->toDateString(),
                ]);
            }
        });

        return response()->json([
            'status'  => 'success',
            'message' => 'Buku berhasil dikembalikan.',
            'data'    => new LoanResource($loan->fresh()->load(['book', 'user'])),
        ]);
    }
}
