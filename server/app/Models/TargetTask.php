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
        'completed',
    ];

    protected $appends = ['created_by_admin', 'completed_by_all_members'];

    public function __construct($attributes = [])
    {
        parent::__construct($attributes);

        $this->attributes['exp'] = 10;
        $this->attributes['completed'] = false;
    }

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

    protected function getCreatedByAdminAttribute()
    {
        /** @var \App\Models\Team $team */
        $team = $this->target()->first()->team()->first();

        $creator_team_role = $team->members()->where('user_id', $this->user_id)->first()->pivot->role;

        return $creator_team_role === 'admin';
    }

    protected function getCompletedByAllMembersAttribute()
    {
        /** @var \App\Models\Team $team */
        $team = $this->target()->first()->team()->first();

        $task_creator_role = $team->members()->where('user_id', $this->user_id)->first()->pivot->role;

        // This attribute only viable when the task is created by admin
        if ($task_creator_role !== 'admin') {
            return false;
        }

        $members = $team->members()->get();

        $allMembersCompleted = true;

        foreach ($members as $member) {
            $approveRequest = $this->taskApproveRequests()->where('user_id', $member->id)->first();

            if (!$approveRequest || $approveRequest->status !== 'approved') {
                $allMembersCompleted = false;
                break;
            }
        }

        return $allMembersCompleted;
    }
}
