<?php

namespace App\Models;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;


class Shift extends Model
{
    protected $fillable = [
        'name',
        'check_in_start',
        'check_in_end',
        'check_out_start',
        'check_out_end',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function getIsActiveAttribute(): bool
    {
        $now = Carbon::now()->format('H:i:s');
        
        // Simple global check-in/out window check
        return ($now >= $this->check_in_start && $now <= $this->check_in_end) ||
               ($now >= $this->check_out_start && $now <= $this->check_out_end);
    }
}

