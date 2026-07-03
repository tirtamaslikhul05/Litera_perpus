<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\LoanResource;
use App\Models\Book;
use App\Models\Loan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminLoanController extends Controller
{
    /**
     * GET /api/admin/loans
     * Menampilkan daftar peminjaman milik sekolah yang login.
     *
     * Filter query params:
     * - ?status=pending | approved | returned
     * - ?search= (cari nama buku atau nama siswa)
     */
    public function index(Request $request)
    {
        $query = Loan::with(['book', 'user'])
                     ->where('school_id', auth()->user()->school_id);

        // Filter status: ?status=pending / approved / returned
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Pencarian: ?search=nama_buku atau nama_siswa
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('book', function ($q) use ($search) {
                    $q->where('nama_buku', 'like', "%{$search}%");
                })->orWhereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            });
        }

        // Urutkan: pending dulu, lalu terbaru
        $loans = $query->orderByRaw("FIELD(status, 'pending', 'approved', 'returned')")
                       ->latest()
                       ->paginate($request->per_page ?? 10);

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
     * PUT /api/admin/loans/{loan}/approve
     * Menyetujui peminjaman buku oleh siswa.
     * Mengubah status dari 'pending' → 'approved'.
     * Mengurangi jumlah_tersedia dan menambah jumlah_pinjam di tabel books.
     */
    public function approve($id)
    {
        $loan = Loan::with('book')
                    ->where('school_id', auth()->user()->school_id)
                    ->find($id);

        if (!$loan) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Peminjaman tidak ditemukan.',
            ], 404);
        }

        if ($loan->status !== 'pending') {
            return response()->json([
                'status'  => 'error',
                'message' => 'Peminjaman sudah diproses sebelumnya.',
            ], 422);
        }

        // Pastikan stok tersedia sebelum diproses
        if ($loan->book->jumlah_tersedia <= 0) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Stok buku tidak tersedia.',
            ], 422);
        }

        // Gunakan DB transaction agar konsisten
        DB::transaction(function () use ($loan) {
            $book = $loan->book;

            // Update stok buku
            $book->decrement('jumlah_tersedia');
            $book->increment('jumlah_pinjam');

            // Update status peminjaman
            $loan->update([
                'status'          => 'approved',
                'tanggal_pinjam'  => now()->toDateString(),
            ]);
        });

        return response()->json([
            'status'  => 'success',
            'message' => 'Peminjaman berhasil disetujui.',
            'data'    => new LoanResource($loan->fresh()->load(['book', 'user'])),
        ]);
    }

    /**
     * PUT /api/admin/loans/{loan}/return
     * Menerima pengembalian buku dari siswa.
     * Mengubah status dari 'approved' → 'returned'.
     * Menambah jumlah_tersedia dan mengurangi jumlah_pinjam di tabel books.
     */
    public function returnBook($id)
    {
        $loan = Loan::with('book')
                    ->where('school_id', auth()->user()->school_id)
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
            'message' => 'Pengembalian buku berhasil diterima.',
            'data'    => new LoanResource($loan->fresh()->load(['book', 'user'])),
        ]);
    }

    /**
     * GET /api/admin/fines
     * Menampilkan daftar denda untuk sekolah yang login.
     */
    public function allFines(Request $request)
    {
        $query = \App\Models\Fine::with(['loan.book', 'user'])
                                 ->where('school_id', auth()->user()->school_id);

        // Filter status: ?status=pending / paid
        if ($request->filled('status')) {
            $query->where('status_denda', $request->status);
        }

        // Pencarian: ?search=nama_siswa
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })->orWhereHas('loan.book', function ($q) use ($search) {
                    $q->where('nama_buku', 'like', "%{$search}%");
                });
            });
        }

        $fines = $query->latest()->paginate($request->per_page ?? 20);

        return response()->json([
            'status' => 'success',
            'data'   => \App\Http\Resources\FineResource::collection($fines->items()),
            'meta'   => [
                'current_page' => $fines->currentPage(),
                'last_page'    => $fines->lastPage(),
                'per_page'     => $fines->perPage(),
                'total'        => $fines->total(),
            ],
        ]);
    }

    /**
     * PUT /api/admin/fines/{fine}/pay
     * Menerima pembayaran denda dari siswa.
     * Mengubah status denda dari 'pending' → 'paid'.
     */
    public function payFine($id)
    {
        $fine = \App\Models\Fine::with('loan.book')
                               ->where('school_id', auth()->user()->school_id)
                               ->find($id);

        if (!$fine) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Denda tidak ditemukan.',
            ], 404);
        }

        if ($fine->status_denda !== 'pending') {
            return response()->json([
                'status'  => 'error',
                'message' => 'Denda ini sudah lunas.',
            ], 422);
        }

        $fine->update([
            'status_denda'  => 'paid',
            'tanggal_lunas' => now()->toDateString(),
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Pembayaran denda berhasil dicatat.',
            'data'    => new \App\Http\Resources\FineResource($fine->fresh()),
        ]);
    }
}
