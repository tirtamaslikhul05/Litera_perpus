<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookResource;
use App\Models\Book;
use Illuminate\Http\Request;

class StudentBookController extends Controller
{
    /**
     * GET /api/student/books
     * Menampilkan daftar semua buku yang tersedia untuk siswa.
     * Hanya menampilkan buku milik sekolah yang sama dengan siswa yang login.
     *
     * Query params:
     * - ?search=  (cari berdasarkan nama_buku atau isbn)
     * - ?tersedia=true/false  (filter stok tersedia / tidak tersedia)
     * - ?pdf=true/false  (filter buku digital / fisik)
     * - ?per_page= (jumlah per halaman, default 10)
     */
    public function index(Request $request)
    {
        $query = Book::where('school_id', auth()->user()->school_id);

        // Pencarian: ?search=nama_buku atau isbn
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_buku', 'like', "%{$search}%")
                  ->orWhere('isbn', 'like', "%{$search}%");
            });
        }

        // Filter ketersediaan: ?tersedia=true (hanya yang stok > 0)
        if ($request->filled('tersedia')) {
            if (filter_var($request->tersedia, FILTER_VALIDATE_BOOLEAN)) {
                $query->where('jumlah_tersedia', '>', 0);
            }
        }

        // Filter digital: ?pdf=true
        if ($request->filled('pdf')) {
            $query->where('pdf', filter_var($request->pdf, FILTER_VALIDATE_BOOLEAN));
        }

        $books = $query->latest()->paginate($request->per_page ?? 10);

        return response()->json([
            'status' => 'success',
            'data'   => BookResource::collection($books->items()),
            'meta'   => [
                'current_page' => $books->currentPage(),
                'last_page'    => $books->lastPage(),
                'per_page'     => $books->perPage(),
                'total'        => $books->total(),
            ],
        ]);
    }

    /**
     * GET /api/student/books/{id}
     * Menampilkan detail satu buku.
     */
    public function show($id)
    {
        $book = Book::where('school_id', auth()->user()->school_id)->find($id);

        if (!$book) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Buku tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data'   => new BookResource($book),
        ]);
    }

    /**
     * GET /api/student/books/{id}/read
     * Mendapatkan akses baca buku digital (PDF).
     * Hanya siswa yang memiliki riwayat peminjaman (approved/returned) yang bisa akses.
     */
    public function read($id)
    {
        $book = Book::where('school_id', auth()->user()->school_id)->find($id);

        if (!$book) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Buku tidak ditemukan.',
            ], 404);
        }

        if (!$book->pdf) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Buku ini tidak memiliki versi digital.',
            ], 404);
        }

        // Verifikasi siswa memiliki akses (pernah meminjam buku ini)
        $hasAccess = $book->loans()
            ->where('user_id', auth()->id())
            ->whereIn('status', ['approved', 'returned'])
            ->exists();

        if (!$hasAccess) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Anda belum memiliki akses ke buku ini. Pinjam buku terlebih dahulu.',
            ], 403);
        }

        // Cari file PDF - asumsikan file disimpan di storage/app/public/pdf/
        $pdfUrl = null;
        // Cek apakah ada field pdf_file di buku, atau kita generate URL dari ISBN
        $pdfPath = 'pdf/' . $book->isbn . '.pdf';
        if (\Illuminate\Support\Facades\Storage::disk('public')->exists($pdfPath)) {
            $pdfUrl = asset('storage/' . $pdfPath);
        }

        return response()->json([
            'status' => 'success',
            'data'   => [
                'book' => [
                    'id'        => $book->id,
                    'nama_buku' => $book->nama_buku,
                    'isbn'      => $book->isbn,
                    'cover'     => $book->cover ? asset('storage/' . $book->cover) : null,
                ],
                'pdf_url' => $pdfUrl,
            ],
        ]);
    }
}
