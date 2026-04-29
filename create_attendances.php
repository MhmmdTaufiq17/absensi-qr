<?php

$users = \App\Models\User::where('role', 'user')
    ->where('email', 'like', 'karyawan%@gmail.com')
    ->get();

$today = \Carbon\Carbon::today()->format('Y-m-d');

foreach ($users as $index => $user) {
    // 5 orang pertama: Absen lengkap (Masuk & Pulang)
    if ($index < 5) {
        \App\Models\AttendanceScan::updateOrCreate(
            ['user_id' => $user->id, 'date' => $today],
            [
                'check_in' => '08:00:00',
                'check_in_status' => 'Berhasil Masuk',
                'check_out' => '17:00:00',
                'check_out_status' => 'Berhasil Pulang'
            ]
        );
    } 
    // 5 orang kedua: Baru absen masuk saja (Status sedang bekerja)
    elseif ($index < 10) {
        \App\Models\AttendanceScan::updateOrCreate(
            ['user_id' => $user->id, 'date' => $today],
            [
                'check_in' => '08:15:00',
                'check_in_status' => 'Terlambat Masuk',
            ]
        );
    } 
    // 5 orang terakhir: Absen lengkap tapi dengan jadwal lain
    else {
        \App\Models\AttendanceScan::updateOrCreate(
            ['user_id' => $user->id, 'date' => $today],
            [
                'check_in' => '07:45:00',
                'check_in_status' => 'Berhasil Masuk',
                'check_out' => '16:30:00',
                'check_out_status' => 'Pulang Cepat'
            ]
        );
    }
}

echo "Berhasil membuat " . $users->count() . " data absensi (dummy) untuk hari ini!\n";
