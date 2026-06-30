<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Http\Resources\StudentResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class StudentController extends Controller
{
    /**
     * GET /api/students
     * Menampilkan daftar semua siswa milik sekolah user yang login.
     */
    public function index(Request $request)
    {
        $query = User::where('school_id', auth()->user()->school_id)
                     ->where('role', 'siswa');

        // Filter pencarian: ?search=nama atau nisn
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nisn', 'like', "%{$search}%");
            });
        }

        // Filter kelas: ?kelas=X
        if ($request->filled('kelas')) {
            $query->where('kelas', $request->kelas);
        }

        // Filter jurusan: ?jurusan=IPA
        if ($request->filled('jurusan')) {
            $query->where('jurusan', $request->jurusan);
        }

        $students = $query->latest()->paginate($request->per_page ?? 10);

        return response()->json([
            'status' => 'success',
            'data'   => StudentResource::collection($students->items()),
            'meta'   => [
                'current_page' => $students->currentPage(),
                'last_page'    => $students->lastPage(),
                'per_page'     => $students->perPage(),
                'total'        => $students->total(),
            ],
        ]);
    }

    /**
     * GET /api/students/{student}
     * Menampilkan detail satu siswa.
     */
    public function show($id)
    {
        $student = User::where('school_id', auth()->user()->school_id)
                       ->where('role', 'siswa')
                       ->find($id);

        if (!$student) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Siswa tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data'   => new StudentResource($student),
        ]);
    }

    /**
     * POST /api/students
     * Menyimpan data siswa baru.
     */
    public function store(StoreStudentRequest $request)
    {
        $data = $request->validated();
        $data['school_id'] = auth()->user()->school_id;
        $data['role'] = 'siswa';
        $data['password'] = Hash::make($data['nisn']); // Password default = NISN

        // Upload foto jika ada
        if ($request->hasFile('foto')) {
            $data['foto'] = $request->file('foto')->store('photos', 'public');
        }

        $student = User::create($data);

        return response()->json([
            'status'  => 'success',
            'message' => 'Siswa berhasil ditambahkan.',
            'data'    => new StudentResource($student),
        ], 201);
    }

    /**
     * PUT/PATCH /api/students/{student}
     * Mengupdate data siswa.
     */
    public function update(UpdateStudentRequest $request, $id)
    {
        $student = User::where('school_id', auth()->user()->school_id)
                       ->where('role', 'siswa')
                       ->find($id);

        if (!$student) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Siswa tidak ditemukan.',
            ], 404);
        }

        $data = $request->validated();

        // Jika ada file foto baru, hapus foto lama
        if ($request->hasFile('foto')) {
            if ($student->foto) {
                Storage::disk('public')->delete($student->foto);
            }
            $data['foto'] = $request->file('foto')->store('photos', 'public');
        }

        $student->update($data);

        return response()->json([
            'status'  => 'success',
            'message' => 'Siswa berhasil diperbarui.',
            'data'    => new StudentResource($student->fresh()),
        ]);
    }

    /**
     * DELETE /api/students/{student}
     * Menghapus data siswa.
     */
    public function destroy($id)
    {
        $student = User::where('school_id', auth()->user()->school_id)
                       ->where('role', 'siswa')
                       ->find($id);

        if (!$student) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Siswa tidak ditemukan.',
            ], 404);
        }

        // Hapus file foto jika ada
        if ($student->foto) {
            Storage::disk('public')->delete($student->foto);
        }

        $student->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Siswa berhasil dihapus.',
        ]);
    }
}
