<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Shift;
use App\Models\AttendanceScan;
use App\Models\GlobalSetting;
use App\Models\User;
use Carbon\Carbon;

class ScannerController extends Controller
{
    public function scans()
    {
        $setting = GlobalSetting::first();
        $isScannerActive = true;
        
        if ($setting && $setting->scanner_active_start && $setting->scanner_active_end) {
            $now = Carbon::now()->format('H:i:s');
            if ($now < $setting->scanner_active_start || $now > $setting->scanner_active_end) {
                $isScannerActive = false;
            }
        }

        return Inertia::render('Scanner/Scan', [
            'isScannerActive' => $isScannerActive,
            'scannerSetting' => $setting
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'qr_code' => 'required|string'
        ]);

        // 1. Global Scanner Operational Hours Check
        $setting = GlobalSetting::first();
        if ($setting && $setting->scanner_active_start && $setting->scanner_active_end) {
            $nowTime = Carbon::now()->format('H:i:s');
            if ($nowTime < $setting->scanner_active_start || $nowTime > $setting->scanner_active_end) {
                return back()->with('error', '❌ Scanner diluar jam operasional.');
            }
        }

        // 2. Parse User ID and Token from QR
        $qrData = explode(':', $request->qr_code);
        if (count($qrData) != 3 || $qrData[0] !== 'user') {
            return back()->with('error', '❌ Format QR Code tidak dikenali atau usang.');
        }

        $userId = $qrData[1];
        $token = $qrData[2];

        // Validasi Token dari Cache
        $cachedToken = \Illuminate\Support\Facades\Cache::get("qr_token_{$userId}");

        if (!$cachedToken || $cachedToken !== $token) {
            return back()->with('error', '❌ QR Code kedaluwarsa atau tidak valid. Silakan refresh halaman QR Anda.');
        }

        $user = User::with('shift')->find($userId);

        if (!$user) {
            return back()->with('error', '❌ Karyawan tidak ditemukan.');
        }

        $shift = $user->shift;
        if (!$shift) {
            return back()->with('error', '❌ ' . $user->name . ' belum memiliki jadwal shift.');
        }

        $today = Carbon::today()->format('Y-m-d');
        $now = Carbon::now();
        $nowTime = $now->format('H:i:s');

        // 3. Find today's record
        $attendance = AttendanceScan::where('user_id', $user->id)
            ->where('date', $today)
            ->first();

        // 4. Logic Windows
        $isInCheckInWindow = $nowTime >= $shift->check_in_start && $nowTime <= $shift->check_in_end;
        $isInCheckOutWindow = $nowTime >= $shift->check_out_start && $nowTime <= $shift->check_out_end;

        // --- CHECK IN LOGIC ---
        if (!$attendance) {
            if (!$isInCheckInWindow) {
                return back()->with('error', "❌ Sesi Masuk ditutup. Window: {$shift->check_in_start} - {$shift->check_in_end}");
            }

            AttendanceScan::create([
                'user_id' => $user->id,
                'date'    => $today,
                'check_in' => $nowTime,
                'check_in_status' => 'Berhasil Masuk',
            ]);

            return back()->with('success', "✅ Berhasil Masuk: {$user->name}. Selamat bekerja!");
        }

        // --- CHECK OUT LOGIC ---
        if ($attendance->check_in && !$attendance->check_out) {
            if (!$isInCheckOutWindow) {
                return back()->with('error', "❌ Sesi Pulang ditutup. Window: {$shift->check_out_start} - {$shift->check_out_end}");
            }

            $attendance->update([
                'check_out' => $nowTime,
                'check_out_status' => 'Berhasil Pulang',
            ]);

            return back()->with('success', "✅ Berhasil Pulang: {$user->name}. Hati-hati dijalan!");
        }

        if ($attendance->check_out) {
            return back()->with('error', "⚠️ {$user->name} sudah melakukan absensi lengkap hari ini.");
        }

        return back()->with('error', '❌ Terjadi kesalahan pada urutan absensi.');
    }
}

