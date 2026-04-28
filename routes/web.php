<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ScannerController;
use App\Http\Controllers\ShiftController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');
});

Route::middleware(['auth', 'role:user'])->group(function () {
    Route::get('/dashboard/user', [DashboardController::class, 'user'])->name('dashboard.user');
});

Route::middleware(['auth', 'role:admin'])->group(function(){
    Route::get('/dashboard/admin', [DashboardController::class, 'admin'])->name('dashboard.admin');
    // User CRUD
    Route::resource('dashboard/users', UserController::class)->names('users');
    // Shift CRUD
    Route::get('/dashboard/shifts', [ShiftController::class, 'index'])->name('shifts.index');
    Route::post('/dashboard/shifts', [ShiftController::class, 'store'])->name('shifts.store');
    Route::put('/dashboard/shifts/{shift}', [ShiftController::class, 'update'])->name('shifts.update');
    Route::delete('/dashboard/shifts/{shift}', [ShiftController::class, 'destroy'])->name('shifts.destroy');
    Route::post('/dashboard/shifts/{shift}/toggle', [ShiftController::class, 'toggleActive'])->name('shifts.toggle');
});

Route::get('/dashboard/scan', [ScannerController::class, 'scans'])->name('scans');
Route::post('/dashboard/scan', [ScannerController::class, 'store'])->name('scans.store');

require __DIR__.'/settings.php';
