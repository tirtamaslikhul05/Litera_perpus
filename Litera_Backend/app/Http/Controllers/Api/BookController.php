<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookRequest;
use App\Http\Requests\UpdateBookRequest;
use App\Http\Resources\BookResource;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BookController extends Controller
{
    /**
     * GET /api/books
     * Menampilkan daftar semua buku milik sekolah user yang login.
     */
    public function index(Request $request)
    {
        $query = Book::where('school_id', auth()->user()->school_id);

        // Filter pencarian: ?search=nama_buku atau isbn
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_buku', 'like', "%{$search}%")
                  ->orWhere('isbn', 'like', "%{$search}%");
            });
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
     * GET /api/books/{book}
     * Menampilkan detail satu buku.
     */
    public function show($id)
    {
        $book = Book::where('school_id', auth()->user()->school_id)
                    ->with('loans')
                    ->find($id);

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
     * POST /api/books
     * Menyimpan buku baru.
     */
    public function store(StoreBookRequest $request)
    {
        $data = $request->validated();
        $data['school_id'] = auth()->user()->school_id;

        // Set default jumlah_pinjam = 0 jika tidak diisi
        if (!isset($data['jumlah_pinjam'])) {
            $data['jumlah_pinjam'] = 0;
        }

        // Hitung jumlah_tersedia
        if (!isset($data['jumlah_tersedia'])) {
            $data['jumlah_tersedia'] = $data['jumlah_buku'] - $data['jumlah_pinjam'];
        }

        // Upload file cover jika ada
        if ($request->hasFile('cover')) {
            $data['cover'] = $request->file('cover')->store('covers', 'public');
        }

        $book = Book::create($data);

        return response()->json([
            'status'  => 'success',
            'message' => 'Buku berhasil ditambahkan.',
            'data'    => new BookResource($book),
        ], 201);
    }

    /**
     * PUT/PATCH /api/books/{book}
     * Mengupdate data buku.
     */
    public function update(UpdateBookRequest $request, $id)
    {
        $book = Book::where('school_id', auth()->user()->school_id)->find($id);

        if (!$book) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Buku tidak ditemukan.',
            ], 404);
        }

        $data = $request->validated();

        // Jika ada file cover baru, hapus cover lama
        if ($request->hasFile('cover')) {
            if ($book->cover) {
                Storage::disk('public')->delete($book->cover);
            }
            $data['cover'] = $request->file('cover')->store('covers', 'public');
        }

        // Hitung ulang jumlah_tersedia jika jumlah_buku berubah
        if (isset($data['jumlah_buku'])) {
            $pinjam = isset($data['jumlah_pinjam']) ? $data['jumlah_pinjam'] : $book->jumlah_pinjam;
            $data['jumlah_tersedia'] = $data['jumlah_buku'] - $pinjam;
        } elseif (isset($data['jumlah_pinjam'])) {
            $data['jumlah_tersedia'] = $book->jumlah_buku - $data['jumlah_pinjam'];
        }

        $book->update($data);

        return response()->json([
            'status'  => 'success',
            'message' => 'Buku berhasil diperbarui.',
            'data'    => new BookResource($book->fresh()),
        ]);
    }

    /**
     * DELETE /api/books/{book}
     * Menghapus buku.
     */
    public function destroy($id)
    {
        $book = Book::where('school_id', auth()->user()->school_id)->find($id);

        if (!$book) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Buku tidak ditemukan.',
            ], 404);
        }

        // Hapus file cover jika ada
        if ($book->cover) {
            Storage::disk('public')->delete($book->cover);
        }

        $book->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Buku berhasil dihapus.',
        ]);
    }
}
