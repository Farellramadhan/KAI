<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asset extends Model
{
    protected $table = 'asset';

    protected $fillable = [
        'stasiun_id',
        'kode_asset',
        'nama_asset',
        'jenis',
        'merk',
        'kondisi',
        'jumlah',
        'model',
        'type'
    ];
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($asset) {
            $asset->kode_asset = 'AST-' . strtoupper(uniqid());
        });
    }

    public function stasiun()
    {
        return $this->belongsTo(Stasiun::class);
    }
}
