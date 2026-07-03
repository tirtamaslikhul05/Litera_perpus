<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'school_id'       => $this->school_id,
            'nama_buku'       => $this->nama_buku,
            'isbn'            => $this->isbn,
            'penulis'         => $this->penulis,
            'penerbit'        => $this->penerbit,
            'kategori'        => $this->kategori,
            'tahun_terbit'    => $this->tahun_terbit,
            'pdf'             => (bool) $this->pdf,
            'jumlah_buku'     => (int) $this->jumlah_buku,
            'jumlah_pinjam'   => (int) $this->jumlah_pinjam,
            'jumlah_tersedia' => (int) $this->jumlah_tersedia,
            'cover'           => $this->cover ? asset('storage/' . $this->cover) : null,
            'created_at'      => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at'      => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
