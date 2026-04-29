<?php

namespace App\Http\Controllers;

// use Illuminate\Http\Request;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Inertia\Inertia;


class DashboardController extends Controller
{
    public function user (Request $request)
    {
        $userId = Auth::id();
        $tokenKey   = "qr_token_{$userId}";
        $createdKey = "qr_token_created_{$userId}";

        // Jika user klik "Generate Ulang QR", hapus token & timestamp lama
        // WAJIB berasal dari Inertia Partial Reload (bukan akses URL langsung di browser)
        if ($request->boolean('regenerate') && $request->header('X-Inertia')) {
            Cache::forget($tokenKey);
            Cache::forget($createdKey);
        }

        // Ambil token yang ada, atau buat baru jika belum ada
        $token = Cache::get($tokenKey);
        if (!$token) {
            $token = Str::random(32);
            Cache::put($tokenKey, $token, now()->addDay()); // Token disimpan lama
            Cache::put($createdKey, now()->timestamp, now()->addDay()); // Simpan waktu pembuatan
        }

        // Hitung sisa waktu berdasarkan timestamp pembuatan token (60 detik batas berlaku)
        $createdAt = Cache::get($createdKey, now()->timestamp);
        $elapsed = now()->timestamp - $createdAt;
        $qrTimeLeft = max(0, 60 - $elapsed); // Sisa detik (0 jika sudah kedaluwarsa)

        $attendances = \App\Models\AttendanceScan::where('user_id', $userId)
            ->latest('date')
            ->limit(7)
            ->get();

        return Inertia::render('Dashboard/User', [
            'user'        => Auth::user(),
            'attendances' => $attendances,
            'qrToken'     => $token,
            'qrTimeLeft'  => $qrTimeLeft, // Sisa waktu dari server (akurat setelah refresh)
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
