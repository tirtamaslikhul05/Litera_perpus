<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $fillable = [
        'school_id',
        'nama_buku',
        'isbn',
        'penulis',
        'penerbit',
        'kategori',
        'tahun_terbit',
        'pdf',
        'jumlah_buku',
        'jumlah_pinjam',
        'jumlah_tersedia',
        'cover',
    ];

    protected $casts = [
        'pdf'             => 'boolean',
        'jumlah_buku'     => 'integer',
        'jumlah_pinjam'   => 'integer',
        'jumlah_tersedia' => 'integer',
    ];

    // Relasi ke School (SaaS multi-tenant)
    public function school()
    {
        return $this->belongsTo(School::class);
    }

    // Relasi ke Loan (peminjaman)
    public function loans()
    {
        return $this->hasMany(Loan::class);
    }
}
