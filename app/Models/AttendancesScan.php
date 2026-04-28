<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttendancesScan extends Model
{
    protected $table = 'attendance_scans';

    protected $fillable = [
        'user_id',
        'time_1',
        'time_2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsto(User::class);
    }
    
}
