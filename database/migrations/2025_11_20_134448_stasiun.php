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
        Schema::create('stasiun', function (Blueprint $table) {
            $table->id();
            $table->string('kode_stasiun', 10)->unique();
            $table->string('nama_stasiun', 100);
            $table->string('alamat', 200);
            $table->string('kota', 100);
            $table->string('provinsi', 100);
            $table->string('wilayah', 100);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
          Schema::dropIfExists('stasiun');
    }
};
