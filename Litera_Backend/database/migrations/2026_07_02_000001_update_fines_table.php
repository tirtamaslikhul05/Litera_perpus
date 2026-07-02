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
        Schema::table('fines', function (Blueprint $table) {
            $table->foreignId('school_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('loan_id')->constrained()->onDelete('cascade');
            $table->decimal('jumlah_denda', 10, 2)->default(0);
            $table->integer('hari_terlambat')->default(0);
            $table->enum('status_denda', ['pending', 'paid'])->default('pending');
            $table->date('tanggal_dikenakan');
            $table->date('tanggal_lunas')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('fines', function (Blueprint $table) {
            $table->dropForeign(['school_id']);
            $table->dropForeign(['user_id']);
            $table->dropForeign(['loan_id']);
            $table->dropColumn(['school_id', 'user_id', 'loan_id', 'jumlah_denda', 'hari_terlambat', 'status_denda', 'tanggal_dikenakan', 'tanggal_lunas']);
        });
    }
};
