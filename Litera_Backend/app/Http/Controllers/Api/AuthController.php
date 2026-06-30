<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    // 1. REGISTER SEKOLAH & ADMIN (SaaS)
    public function register(Request $request)
    {
        $validated = $request->validate([
            'school_name' => 'required|string|max:255|unique:schools,name',
            'admin_name'  => 'required|string|max:255',
            'email'       => 'required|string|email|unique:users,email',
            'password'    => 'required|string|min:6',
        ]);

        $school = School::create([
            'name'        => $request->school_name,
            'license_key' => Str::uuid(),
        ]);

        $admin = User::create([
            'school_id' => $school->id,
            'name'      => $request->admin_name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'role'      => 'admin',
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Sekolah dan Admin berhasil didaftarkan!',
            'data'    => [
                'user'  => $admin,
                'school' => $school
            ]
        ], 201);
    }

    // 2. LOGIN PINTAR (Bisa pakai Email atau NISN)
    public function login(Request $request)
    {
        $validated = $request->validate([
            'login_id' => 'required|string',
            'password' => 'required|string',
        ]);

        // Cek format, kalau ada @ berarti email, selain itu berarti nisn
        $loginType = filter_var($request->login_id, FILTER_VALIDATE_EMAIL) ? 'email' : 'nisn';

        $user = User::where($loginType, $request->login_id)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Kredensial tidak valid'
            ], 401);
        }

        // Buat Token Sanctum
        $token = $user->createToken('litera-token')->plainTextToken;

        return response()->json([
            'status'  => 'success',
            'message' => 'Login berhasil',
            'data'    => [
                'user'  => $user,
                'token' => $token,
                'role'  => $user->role
            ]
        ], 200);
    }

    // 3. REGISTER SISWA (oleh Admin)
    public function registerStudent(Request $request)
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'nisn'      => 'required|string|unique:users,nisn',
            'school_id' => 'required|integer|exists:schools,id',
            'kelas'     => 'sometimes|required|string|max:50',
            'jurusan'   => 'sometimes|required|string|max:100',
        ]);

        $user = User::create([
            'school_id' => $request->school_id,
            'name'      => $request->name,
            'nisn'      => $request->nisn,
            'kelas'     => $request->kelas,
            'jurusan'   => $request->jurusan,
            'password'  => Hash::make($request->nisn), // password default = NISN
            'role'      => 'siswa',
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Akun siswa berhasil dibuat',
            'data'    => $user
        ], 201);
    }

    // 4. LOGOUT
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Logout berhasil'
        ], 200);
    }
}