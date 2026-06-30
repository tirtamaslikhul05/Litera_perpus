<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'school_id', 'nisn', 'name', 'email', 'password', 'role',
        'kelas', 'jurusan', 'foto',
    ];

    protected $hidden = [
        'password', 'remember_token', 'nisn',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // Relasi
    public function school() {
        return $this->belongsTo(School::class);
    }
    public function loans() {
        return $this->hasMany(Loan::class);
    }
    public function fines() {
        return $this->hasMany(Fine::class);
    }

    // Accessor: URL foto lengkap
    public function getFotoUrlAttribute()
    {
        return $this->foto ? asset('storage/' . $this->foto) : null;
    }
}
