<?php

namespace App\Events;


use Carbon\Traits\Serialization;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AttendanceScanned implements ShouldBroadcastNow
{
    
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $message;

    public function __construct($message)
    {
        $this->message = $message;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('attendance')
        ];
    }

    public function broadcastAs():string
    {
        return 'scan.created';
    }


}