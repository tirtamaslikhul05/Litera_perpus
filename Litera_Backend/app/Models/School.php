<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class School extends Model
{
    protected $fillable = [
        'name',
        'license_key',
    ];
    // Relasi ke tabel User
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
