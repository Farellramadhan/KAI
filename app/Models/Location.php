<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'latitude',
        'longitude',
        'category',
        'description',
        'image_url',
    ];

    public function devices()
    {
        return $this->hasMany(Device::class);
    }
}
