<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use App\Models\Book;
use Illuminate\Http\Request;

class StudentWishlistController extends Controller
{
    /**
     * GET /api/student/wishlists
     * Menampilkan daftar wishlist milik siswa yang login.
     */
    public function index(Request $request)
    {
        $wishlists = Wishlist::with(['book'])
                             ->where('school_id', auth()->user()->school_id)
                             ->where('user_id', auth()->id())
                             ->latest()
                             ->paginate($request->per_page ?? 10);

        return response()->json([
            'status' => 'success',
            'data'   => $wishlists->items(),
            'meta'   => [
                'current_page' => $wishlists->currentPage(),
                'last_page'    => $wishlists->lastPage(),
                'per_page'     => $wishlists->perPage(),
                'total'        => $wishlists->total(),
            ],
        ]);
    }

    /**
     * POST /api/student/wishlists
     * Menambahkan buku ke wishlist.
     */
    public function store(Request $request)
    {
        $request->validate([
            'book_id' => 'required|integer|exists:books,id',
            'catatan' => 'sometimes|string|max:500',
        ]);

        $user = auth()->user();
        $book = Book::where('school_id', $user->school_id)->find($request->book_id);

        if (!$book) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Buku tidak ditemukan.',
            ], 404);
        }

        // Cek apakah sudah ada di wishlist
        $exists = Wishlist::where('school_id', $user->school_id)
                          ->where('user_id', $user->id)
                          ->where('book_id', $book->id)
                          ->exists();

        if ($exists) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Buku sudah ada di wishlist Anda.',
            ], 422);
        }

        $wishlist = Wishlist::create([
            'school_id' => $user->school_id,
            'user_id'   => $user->id,
            'book_id'   => $book->id,
            'catatan'   => $request->catatan,
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Buku berhasil ditambahkan ke wishlist.',
            'data'    => $wishlist->load('book'),
        ], 201);
    }

    /**
     * DELETE /api/student/wishlists/{id}
     * Menghapus buku dari wishlist.
     */
    public function destroy($id)
    {
        $wishlist = Wishlist::where('school_id', auth()->user()->school_id)
                            ->where('user_id', auth()->id())
                            ->find($id);

        if (!$wishlist) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Wishlist tidak ditemukan.',
            ], 404);
        }

        $wishlist->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Buku berhasil dihapus dari wishlist.',
        ]);
    }
}
