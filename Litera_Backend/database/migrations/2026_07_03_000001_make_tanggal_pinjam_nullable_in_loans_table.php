<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Mengubah kolom tanggal_pinjam menjadi nullable karena:
     * - Pending loan belum memiliki tanggal_pinjam (hanya diisi saat approve)
     * - Hanya loan dengan status 'approved' yang memiliki tanggal_pinjam
     */
    public function up(): void
    {
        Schema::table('loans', function (Blueprint $table) {
            $table->date('tanggal_pinjam')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('loans', function (Blueprint $table) {
            $table->date('tanggal_pinjam')->nullable(false)->change();
        });
    }
};
