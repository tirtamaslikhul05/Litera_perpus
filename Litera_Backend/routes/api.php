<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\AdminLoanController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Di sini semua endpoint API untuk autentikasi, manajemen user, manajemen buku,
| manajemen siswa, dan manajemen peminjaman oleh admin.
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
});
