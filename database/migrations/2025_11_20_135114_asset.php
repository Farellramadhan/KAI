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

            // foreign key ke stasiun
            $table->unsignedBigInteger('stasiun_id');
            $table->string('kode_asset', 30);
            $table->string('nama_asset', 100);
            $table->string('jenis', 100);
            $table->integer('jumlah');
            $table->string('kondisi', 50);
            $table->string('merk', 100)->nullable();
            $table->string('model', 100)->nullable();
            $table->string('type', 100)->nullable();

            $table->timestamps();

            // relasi FK
            $table->foreign('stasiun_id')
                ->references('id')
                ->on('stasiun')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asset');
    }
};
