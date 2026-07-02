<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FineResource;
use App\Models\Fine;
use Illuminate\Http\Request;

class StudentFineController extends Controller
{
    /**
     * GET /api/student/fines
     * Menampilkan daftar semua denda milik siswa yang login.
     *
     * Query params:
     * - ?status=pending | paid
     */
    public function index(Request $request)
    {
        $query = Fine::with(['loan.book'])
                     ->where('school_id', auth()->user()->school_id)
                     ->where('user_id', auth()->id());

        // Filter status denda
        if ($request->filled('status')) {
            $query->where('status_denda', $request->status);
        }

        $fines = $query->latest()->paginate($request->per_page ?? 10);

        return response()->json([
            'status' => 'success',
            'data'   => FineResource::collection($fines->items()),
            'meta'   => [
                'current_page' => $fines->currentPage(),
                'last_page'    => $fines->lastPage(),
                'per_page'     => $fines->perPage(),
                'total'        => $fines->total(),
            ],
        ]);
    }

    /**
     * GET /api/student/fines/total
     * Menampilkan total denda yang belum dibayar.
     */
    public function total()
    {
        $total = Fine::where('school_id', auth()->user()->school_id)
                     ->where('user_id', auth()->id())
                     ->where('status_denda', 'pending')
                     ->sum('jumlah_denda');

        return response()->json([
            'status' => 'success',
            'data'   => [
                'total_denda'   => (float) $total,
                'jumlah_item'   => Fine::where('school_id', auth()->user()->school_id)
                                       ->where('user_id', auth()->id())
                                       ->where('status_denda', 'pending')
                                       ->count(),
            ],
        ]);
    }
}
