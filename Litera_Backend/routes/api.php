<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\AdminLoanController;
use App\Http\Controllers\Api\StudentBookController;
use App\Http\Controllers\Api\StudentLoanController;
use App\Http\Controllers\Api\StudentFineController;
use App\Http\Controllers\Api\StudentProfileController;
use App\Http\Controllers\Api\StudentWishlistController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Di sini semua endpoint API untuk autentikasi, manajemen user, manajemen buku,
| manajemen siswa, manajemen peminjaman oleh admin, dan fitur-fitur siswa.
|
*/

// ==================== PUBLIC ROUTES (TIDAK PERLU LOGIN) ====================

// Registrasi sekolah & admin baru
Route::post('/register', [AuthController::class, 'register']);

// Login (bisa pakai email atau NISN)
Route::post('/login', [AuthController::class, 'login']);


// ==================== PROTECTED ROUTES (WAJIB LOGIN + TOKEN) ====================
Route::middleware('auth:sanctum')->group(function () {

    // Logout (hapus token aktif)
    Route::post('/logout', [AuthController::class, 'logout']);

    // Registrasi siswa baru (khusus admin)
    Route::post('/register-student', [AuthController::class, 'registerStudent']);

    // Lihat data user yang sedang login
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });

    // Lihat role user yang sedang login
    Route::get('/user/role', function (Request $request) {
        return response()->json([
            'status' => 'success',
            'data'   => [
                'role' => $request->user()->role
            ]
        ]);
    });

    // ==================== MANAJEMEN BUKU (CRUD) ====================
    Route::apiResource('/books', BookController::class);

    // ==================== MANAJEMEN SISWA (CRUD) ====================
    Route::apiResource('/students', StudentController::class);

    // ==================== ADMIN LOAN MANAGEMENT ====================
    Route::prefix('/admin')->group(function () {
        Route::get('/loans', [AdminLoanController::class, 'index']);
        Route::put('/loans/{loan}/approve', [AdminLoanController::class, 'approve']);
        Route::put('/loans/{loan}/return', [AdminLoanController::class, 'returnBook']);
    });

    // ==================== FITUR-FITUR SISWA ====================
    Route::prefix('/student')->group(function () {

        // 🔍 Search Buku (MD-2) & 📄 Baca Buku Digital (MD-6)
        Route::get('/books', [StudentBookController::class, 'index']);
        Route::get('/books/{id}', [StudentBookController::class, 'show']);
        Route::get('/books/{id}/read', [StudentBookController::class, 'read']);

        // 📖 Peminjaman (MD-3), 📚 Rak Buku (MD-4), 🔄 Pengembalian (MD-5)
        Route::get('/loans', [StudentLoanController::class, 'index']);
        Route::post('/loans', [StudentLoanController::class, 'store']);
        Route::put('/loans/{id}/return', [StudentLoanController::class, 'returnBook']);

        // 💰 Status Denda (MD-7)
        Route::get('/fines', [StudentFineController::class, 'index']);
        Route::get('/fines/total', [StudentFineController::class, 'total']);

        // 👤 Profil Siswa (MD-8)
        Route::get('/profile', [StudentProfileController::class, 'show']);
        Route::put('/profile', [StudentProfileController::class, 'update']);

        // ⭐ Wishlist Buku (MD-9)
        Route::get('/wishlists', [StudentWishlistController::class, 'index']);
        Route::post('/wishlists', [StudentWishlistController::class, 'store']);
        Route::delete('/wishlists/{id}', [StudentWishlistController::class, 'destroy']);
    });
});
