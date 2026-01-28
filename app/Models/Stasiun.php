<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stasiun extends Model
{
    protected $table = 'stasiun';

    protected $fillable = [
        'kode_stasiun',
        'nama_stasiun',
        'alamat',
        'kota',
        'provinsi',
        'wilayah'
    ];

    public function asset()
    {
        return $this->hasMany(Asset::class);
    }
}
