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

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function tasks()
    {
        return $this->hasMany(TargetTask::class);
    }
}
