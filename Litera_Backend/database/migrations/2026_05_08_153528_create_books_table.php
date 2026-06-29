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
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->onDelete('cascade');
            $table->string('nama_buku', 255);
            $table->string('isbn', 20);
            $table->boolean('pdf')->default(false);
            $table->integer('jumlah_buku')->default(0);
            $table->integer('jumlah_pinjam')->default(0);
            $table->integer('jumlah_tersedia')->default(0);
            $table->string('cover', 255)->nullable();
            $table->timestamps();

            $table->unique(['school_id', 'isbn']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
