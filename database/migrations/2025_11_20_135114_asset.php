<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('asset', function (Blueprint $table) {
            $table->id();

            // foreign key ke lokasi via kode_tempat
            $table->string('kode_tempat', 20);
            $table->string('jenis_perangkat', 100);
            $table->string('hostname', 150);
            $table->string('merk_spek', 200)->nullable();
            $table->string('ip_perangkat', 45);
            $table->string('lokasi', 150)->nullable();
            $table->enum('kondisi', ['SO', 'TSO'])->default('SO');

            $table->timestamps();

            // relasi FK
            $table->foreign('kode_tempat')
                ->references('kode_tempat')
                ->on('tempat')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asset');
    }
};
