<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tempat extends Model
{
    protected $table = 'tempat';

    protected $fillable = [
        'kode_tempat',
        'nama_tempat',
        'jenis_tempat',
        'longitude',
        'latitude',
        'gambar'
    ];

    protected $appends = ['devices_count'];

    public function assets()
    {
        return $this->hasMany(Asset::class, 'kode_tempat', 'kode_tempat');
    }

    public function getDevicesCountAttribute()
    {
        return $this->assets()->count();
    }
}
