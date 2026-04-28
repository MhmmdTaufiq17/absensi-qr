<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ShiftSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table("shifts")->insert([
            [
                'name' => 'Shift Pagi',
                'check_in_start' => '07:00:00',
                'check_in_end' => '09:00:00',
                'check_out_start' => '16:00:00',
                'check_out_end' => '18:00:00',
                'is_active' => true
            ],
            [
                'name' => 'Shift Malam',
                'check_in_start' => '19:00:00',
                'check_in_end' => '21:00:00',
                'check_out_start' => '05:00:00',
                'check_out_end' => '07:00:00',
                'is_active' => false
            ]
        ]);
    }
}
