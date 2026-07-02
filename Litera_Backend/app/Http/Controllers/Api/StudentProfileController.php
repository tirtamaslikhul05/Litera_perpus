<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class StudentProfileController extends Controller
{
    /**
     * GET /api/student/profile
     * Menampilkan data profil siswa yang login.
     */
    public function show()
    {
        $user = auth()->user()->load('school');

        return response()->json([
            'status' => 'success',
            'data'   => new StudentResource($user),
        ]);
    }

    /**
     * PUT /api/student/profile
     * Memperbarui data profil siswa yang login.
     *
     * Body opsional:
     * - name (string)
     * - kelas (string)
     * - jurusan (string)
     * - foto (file)
     */
    public function update(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'name'    => 'sometimes|required|string|max:255',
            'kelas'   => 'sometimes|required|string|max:50',
            'jurusan' => 'sometimes|required|string|max:100',
            'foto'    => 'sometimes|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $data = $validated;

        // Upload foto jika ada
        if ($request->hasFile('foto')) {
            // Hapus foto lama
            if ($user->foto) {
                Storage::disk('public')->delete($user->foto);
            }
            $data['foto'] = $request->file('foto')->store('photos', 'public');
        }

        $user->update($data);

        return response()->json([
            'status'  => 'success',
            'message' => 'Profil berhasil diperbarui.',
            'data'    => new StudentResource($user->fresh()),
        ]);
    }
}
