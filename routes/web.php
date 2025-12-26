<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;


// Main SPA route
Route::get('/', function () {
    return view('app');
})->name('login');

// SPA catch-all routes (React Router handles the rest)
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');


