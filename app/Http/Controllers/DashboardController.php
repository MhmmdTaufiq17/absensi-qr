<?php

namespace App\Http\Controllers;

// use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;


class DashboardController extends Controller
{
    public function user ()
    {
        $userId = Auth::id();
        
        // Cek jika token sudah ada di cache, gunakan yang ada. Jika tidak, buat baru.
        $token = \Illuminate\Support\Facades\Cache::remember("qr_token_{$userId}", 60, function () {
            return \Illuminate\Support\Str::random(32);
        });

        $attendances = \App\Models\AttendanceScan::where('user_id', $userId)
            ->latest('date')
            ->limit(7)
            ->get();

        return Inertia::render('Dashboard/User', [
            'user' => Auth::user(),
            'attendances' => $attendances,
            'qrToken' => $token
        ]);
    }

    public function admin ()
    {
        $activeShift = \App\Models\Shift::where('is_active', true)->first();
        return Inertia::render('Dashboard/Admin', [
            'activeShift' => $activeShift
        ]);
    }

    public function dashboard ()
    {
        if (Auth::user()->role === 'admin'){
            return redirect()->route('dashboard.admin');
        } else {
            return redirect()->route ('dashboard.user');
        }
    }
}
