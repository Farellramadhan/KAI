<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('app');
})->name('login');

Route::get('/register', function () {
    return view('app');
});

Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::get('/logout', [AuthController::class, 'logout'])->name('logout');

Route::get('/home', function () { 
    return view('app'); 
});

Route::get('/dashboard', function () { return view('app'); })
    ->middleware('auth')
    ->name('dashboard');
Route::get('/akun', function () { return view('app'); })
    ->middleware('auth')
    ->name('profile');

Route::get('/tes',function(){
    return view('test');
});


