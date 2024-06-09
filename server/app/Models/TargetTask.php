<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TargetTask extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'target_tasks';

    protected $fillable = [
        'title',
        'description',
        'due',
        'exp',
        'target_id',
        'user_id',
    ];

    public function target()
    {
        return $this->belongsTo(Target::class);
    }

    public function taskApproveRequests()
    {
        return $this->hasMany(TaskApproveRequest::class, 'task_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
