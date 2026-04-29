<?php

namespace App\Http\Controllers;

use App\Models\AttendanceScan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index()
    {
        $attendances = AttendanceScan::with('user')->latest('date')->latest('check_in')->get();
        return Inertia::render('Admin/Attendances/Index', [
            'attendances' => $attendances
        ]);
    }
}
