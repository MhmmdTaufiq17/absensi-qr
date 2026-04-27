<?php

namespace App\Http\Controllers;

// use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;


class DashboardController extends Controller
{
    public function user ()
    {
        return Inertia::render('Dashboard/User');
    }

    public function admin ()
    {
        return Inertia::render('Dashboard/Admin');
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
