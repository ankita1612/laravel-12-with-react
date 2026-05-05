<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmployeeController;

/**
 * Authentication Routes
 * Public routes - no authentication required
 */
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->name('auth.register');
    Route::post('/login', [AuthController::class, 'login'])->name('auth.login');
});

/**
 * Protected Routes
 * Requires authentication via Sanctum
 */
Route::middleware('auth:sanctum')->group(function () {
    // Authentication routes
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');
        Route::get('/profile', [AuthController::class, 'profile'])->name('auth.profile');
    });

    // Employee API routes - protected
    Route::apiResource('employees', EmployeeController::class);
});

