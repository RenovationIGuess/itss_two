<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'teams';

    protected $fillable = [
        'name',
        'user_id',
        'join_code',
    ];

    protected $appends = [
        'members_count',
        'targets_count',
        'tasks_count',
        'requests_count'
    ];

    public function creator()
    {
        return $this->belongsTo(User::class);
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'team_user_pivot')
            ->withPivot('role', 'exp')
            ->withTimestamps();
    }

    public function targets()
    {
        return $this->hasMany(Target::class);
    }

    public function getMembersCountAttribute()
    {
        return $this->members()->count();
    }

    public function getTargetsCountAttribute()
    {
        return $this->targets()->count();
    }

    public function getTasksCountAttribute()
    {
        return $this->targets()->with('tasks')->get()->sum(function ($target) {
            return $target->tasks->count();
        });
    }

    public function getRequestsCountAttribute()
    {
        return $this->targets()->with('tasks')->get()->sum(function ($target) {
            return $target->tasks()->with('taskApproveRequests')->get()->sum(function ($task) {
                return $task->taskApproveRequests->count();
            });
        });
    }
}
