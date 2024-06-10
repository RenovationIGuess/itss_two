<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskApproveRequest extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'task_approve_requests';

    protected $fillable = [
        'evidence',
        'status',
        'task_id',
        'user_id',
    ];

    public function __construct($attributes = [])
    {
        parent::__construct($attributes);

        $this->attributes['status'] = 'pending';
    }

    public function task()
    {
        return $this->belongsTo(TargetTask::class, 'task_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
