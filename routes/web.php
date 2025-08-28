<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AgentController;
use App\Http\Controllers\AgentBlockedTimeController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\BookingController;
use App\Http\Middleware\CheckRole;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Home page - main booking interface
Route::get('/', [BookingController::class, 'index'])->name('home');

// API route for booking availability
Route::get('/api/booking/availability', [BookingController::class, 'show'])->name('api.booking.availability');

// Authentication required routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard redirects based on user role
    Route::get('dashboard', function () {
        $user = auth()->user();
        
        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        } elseif ($user->isAgent()) {
            return redirect()->route('agent.dashboard');
        } else {
            return Inertia::render('dashboard');
        }
    })->name('dashboard');

    // Appointment management (all roles)
    Route::resource('appointments', AppointmentController::class);

    // Admin routes
    Route::middleware([CheckRole::class . ':admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('dashboard');
        Route::get('/services', function() {
            return redirect()->route('admin.dashboard', ['type' => 'services']);
        })->name('services');
        Route::get('/agents', function() {
            return redirect()->route('admin.dashboard', ['type' => 'agents']);
        })->name('agents');
        Route::get('/appointments', function() {
            return redirect()->route('admin.dashboard', ['type' => 'appointments']);
        })->name('appointments');
        Route::get('/manage', [AdminController::class, 'show'])->name('manage');
    });

    // Agent routes
    Route::middleware([CheckRole::class . ':agent'])->prefix('agent')->name('agent.')->group(function () {
        Route::get('/', [AgentController::class, 'index'])->name('dashboard');
        Route::get('/availability', [AgentController::class, 'edit'])->name('availability');
        Route::post('/availability', [AgentController::class, 'update'])->name('availability.store');
        Route::get('/appointments', [AgentController::class, 'show'])->name('appointments');
        Route::post('/block-time', [AgentBlockedTimeController::class, 'store'])->name('block-time');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';