<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    use HasFactory;

    protected $fillable = [
        'location_id',
        'name',
        'type',
        'status',
        'serial_number',
        'description',
    ];

    public function location()
    {
        return $this->belongsTo(Location::class);
    }
}
