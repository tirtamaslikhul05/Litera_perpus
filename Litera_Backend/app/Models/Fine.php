<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fine extends Model
{
    protected $fillable = [
        'school_id',
        'user_id',
        'loan_id',
        'jumlah_denda',
        'hari_terlambat',
        'status_denda',
        'tanggal_dikenakan',
        'tanggal_lunas',
    ];

    protected $casts = [
        'jumlah_denda'     => 'decimal:2',
        'hari_terlambat'   => 'integer',
        'tanggal_dikenakan' => 'date:Y-m-d',
        'tanggal_lunas'    => 'date:Y-m-d',
    ];

    // Relasi ke School (SaaS multi-tenant)
    public function school()
    {
        return $this->belongsTo(School::class);
    }

    // Relasi ke User (siswa)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke Loan (peminjaman terkait)
    public function loan()
    {
        return $this->belongsTo(Loan::class);
    }
}
