<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AttendanceScan extends Model
{
    protected $table = 'attendance_scans';

    protected $fillable = [
        'user_id',
        'date',
        'check_in',
        'check_out',
        'check_in_status',
        'check_out_status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
