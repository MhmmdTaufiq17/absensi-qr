<?php

namespace App\Http\Controllers;

// use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;


class DashboardController extends Controller
{
    public function user ()
    {
        return Inertia::render('Dashboard/User', [
            'user' => Auth::user()
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
