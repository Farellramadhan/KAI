<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asset extends Model
{
    protected $table = 'asset';

    protected $fillable = [
        'kode_tempat',
        'jenis_perangkat',
        'hostname',
        'merk_spek',
        'ip_perangkat',
        'lokasi',
        'kondisi'
    ];

    public function tempat()
    {
        return $this->belongsTo(Tempat::class, 'kode_tempat', 'kode_tempat');
    }
}
