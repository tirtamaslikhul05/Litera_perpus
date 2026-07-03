<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FineResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $loanData = null;
        if ($this->relationLoaded('loan') && $this->loan) {
            $bookData = null;
            if ($this->loan->relationLoaded('book') && $this->loan->book) {
                $bookData = [
                    'id'        => $this->loan->book->id,
                    'nama_buku' => $this->loan->book->nama_buku,
                    'isbn'      => $this->loan->book->isbn,
                    'cover'     => $this->loan->book->cover ? asset('storage/' . $this->loan->book->cover) : null,
                ];
            }
            $loanData = [
                'id'                => $this->loan->id,
                'tanggal_pinjam'    => $this->loan->tanggal_pinjam?->format('Y-m-d'),
                'tanggal_jatuh_tempo' => $this->loan->tanggal_jatuh_tempo?->format('Y-m-d'),
                'tanggal_kembali'   => $this->loan->tanggal_kembali?->format('Y-m-d'),
                'status'            => $this->loan->status,
                'book'              => $bookData,
            ];
        }

        // Data siswa (user)
        $studentData = null;
        if ($this->relationLoaded('user') && $this->user) {
            $studentData = [
                'id'      => $this->user->id,
                'name'    => $this->user->name,
                'nisn'    => $this->user->nisn,
                'kelas'   => $this->user->kelas,
                'jurusan' => $this->user->jurusan,
                'foto'    => $this->user->foto ? asset('storage/' . $this->user->foto) : null,
            ];
        }

        return [
            'id'              => $this->id,
            'student'         => $studentData,
            'loan'            => $loanData,
            'jumlah_denda'     => (float) $this->jumlah_denda,
            'hari_terlambat'   => (int) $this->hari_terlambat,
            'status_denda'     => $this->status_denda,
            'tanggal_dikenakan'=> $this->tanggal_dikenakan?->format('Y-m-d'),
            'tanggal_lunas'    => $this->tanggal_lunas?->format('Y-m-d'),
            'created_at'       => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at'       => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
