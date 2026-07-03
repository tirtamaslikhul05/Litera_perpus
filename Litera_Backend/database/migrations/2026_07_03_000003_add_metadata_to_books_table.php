<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('books', function (Blueprint $table) {
            $table->string('penulis', 255)->nullable()->after('isbn');
            $table->string('penerbit', 255)->nullable()->after('penulis');
            $table->string('kategori', 100)->nullable()->after('penerbit');
            $table->year('tahun_terbit')->nullable()->after('kategori');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('books', function (Blueprint $table) {
            $table->dropColumn(['penulis', 'penerbit', 'kategori', 'tahun_terbit']);
        });
    }
};
