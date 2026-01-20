<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\DeviceController;



// Authentication
Route::middleware('web')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/logout', [AuthController::class, 'logout']);
});

Route::middleware(['web', 'auth'])->get('/user', [AuthController::class, 'user']);

// Locations
Route::get('/locations', [LocationController::class, 'index']);
Route::get('/locations/search', [LocationController::class, 'search']);
Route::get('/locations/{id}', [LocationController::class, 'show']);

// Authenticated routes
Route::middleware(['web', 'auth'])->group(function () {
    // Location Management
    Route::post('/locations', [LocationController::class, 'store']);
    Route::put('/locations/{id}', [LocationController::class, 'update']);
    Route::delete('/locations/{id}', [LocationController::class, 'destroy']);

    // Device Management
    Route::get('/devices', [DeviceController::class, 'index']);
    Route::get('/devices/stats', [DeviceController::class, 'stats']);
    Route::get('/locations/{locationId}/devices', [DeviceController::class, 'devicesByLocation']);
    Route::get('/devices/{id}', [DeviceController::class, 'show']);
    Route::post('/devices', [DeviceController::class, 'store']);
    Route::put('/devices/{id}', [DeviceController::class, 'update']);
    Route::patch('/devices/{id}/status', [DeviceController::class, 'updateStatus']);
    Route::delete('/devices/{id}', [DeviceController::class, 'destroy']);
});
