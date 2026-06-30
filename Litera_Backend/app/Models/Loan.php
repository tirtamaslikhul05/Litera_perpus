<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    protected $fillable = [
        'school_id',
        'book_id',
        'user_id',
        'tanggal_pinjam',
        'tanggal_jatuh_tempo',
        'tanggal_kembali',
        'status',
    ];

    protected $casts = [
        'tanggal_pinjam'      => 'date:Y-m-d',
        'tanggal_jatuh_tempo' => 'date:Y-m-d',
        'tanggal_kembali'     => 'date:Y-m-d',
    ];

    // Relasi ke School (SaaS multi-tenant)
    public function school()
    {
        return $this->belongsTo(School::class);
    }

    // Relasi ke Book yang dipinjam
    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    // Relasi ke User (siswa) yang meminjam
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
