<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'school_id'  => $this->school_id,
            'name'       => $this->name,
            'nisn'       => $this->nisn,
            'kelas'      => $this->kelas,
            'jurusan'    => $this->jurusan,
            'foto'       => $this->foto ? asset('storage/' . $this->foto) : null,
            'role'       => $this->role,
            'status'     => $this->status ?? 'Aktif',
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
