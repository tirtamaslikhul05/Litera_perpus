<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LoanResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'book' => [
                'id'        => $this->book->id,
                'nama_buku' => $this->book->nama_buku,
                'isbn'      => $this->book->isbn,
                'cover'     => $this->book->cover ? asset('storage/' . $this->book->cover) : null,
            ],
            'student' => [
                'id'      => $this->user->id,
                'name'    => $this->user->name,
                'nisn'    => $this->user->nisn,
                'kelas'   => $this->user->kelas,
                'jurusan' => $this->user->jurusan,
                'foto'    => $this->user->foto ? asset('storage/' . $this->user->foto) : null,
            ],
            'tanggal_pinjam'      => $this->tanggal_pinjam?->format('Y-m-d'),
            'tanggal_jatuh_tempo' => $this->tanggal_jatuh_tempo?->format('Y-m-d'),
            'tanggal_kembali'     => $this->tanggal_kembali?->format('Y-m-d'),
            'status'              => $this->status,
            'created_at'          => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at'          => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
