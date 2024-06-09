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
}
