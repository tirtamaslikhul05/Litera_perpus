<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wishlist extends Model
{
    protected $fillable = [
        'school_id',
        'user_id',
        'book_id',
        'catatan',
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

    // Relasi ke Book
    public function book()
    {
        return $this->belongsTo(Book::class);
    }
}
