<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Target extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'targets';

    protected $fillable = [
        'title',
        'description',
        'due',
        'exp',
        'team_id',
    ];

    protected $appends = ['is_completed'];

    public function __construct($attributes = [])
    {
        parent::__construct($attributes);

        $this->attributes['exp'] = 10;
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function tasks()
    {
        return $this->hasMany(TargetTask::class);
    }

    protected function getIsCompletedAttribute()
    {
        /** @var \App\Models\Team $team */
        $team = $this->team()->first();

        $members = $team->members()->get();

        $targetTasks = $this->tasks()->get();

        $allTasksCompleted = true;

        foreach ($targetTasks as $task) {
            foreach ($members as $member) {
                $approveRequest = $task->taskApproveRequests()->where('user_id', $member->id)->first();

                if (!$approveRequest || $approveRequest->status !== 'approved') {
                    $allTasksCompleted = false;
                    break 2; // Break out of both loops
                }
            }
        }

        return $allTasksCompleted;
    }
}
