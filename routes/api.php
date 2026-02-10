<?php

use App\Http\Controllers\LocationController;
use App\Http\Controllers\DeviceController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


// Auth routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout']);

// Password Reset routes
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/verify-reset-code', [AuthController::class, 'verifyResetCode']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Get authenticated user (requires authentication)
Route::middleware('auth')->get('/user', [AuthController::class, 'user']);

// Locations API
Route::get('/locations/search', [LocationController::class, 'search']);
Route::get('/locations/stats', [LocationController::class, 'stats']);
Route::get('/locations', [LocationController::class, 'index']);
Route::get('/locations/{id}', [LocationController::class, 'show']);

// Protected location routes (require authentication)
Route::middleware('auth')->group(function () {
    Route::post('/locations', [LocationController::class, 'store']);
    Route::post('/locations/bulk-delete', [LocationController::class, 'bulkDestroy']);
    Route::put('/locations/{id}', [LocationController::class, 'update']);
    Route::delete('/locations/{id}', [LocationController::class, 'destroy']);
});

// Devices API
Route::get('/devices/stats', [DeviceController::class, 'stats']);
Route::get('/locations/{locationId}/devices', [DeviceController::class, 'getByLocation']);
Route::get('/devices/import-template', [DeviceController::class, 'importTemplate']);

// Protected device routes (require authentication)
Route::middleware('auth')->group(function () {
    Route::get('/devices', [DeviceController::class, 'index']);
    Route::get('/devices/{id}', [DeviceController::class, 'show']);
    Route::post('/devices', [DeviceController::class, 'store']);
    Route::post('/devices/bulk-delete', [DeviceController::class, 'bulkDestroy']);
    Route::post('/devices/bulk-import', [DeviceController::class, 'bulkImport']);
    Route::put('/devices/{id}', [DeviceController::class, 'update']);
    Route::patch('/devices/{id}/status', [DeviceController::class, 'updateStatus']);
    Route::delete('/devices/{id}', [DeviceController::class, 'destroy']);
});
