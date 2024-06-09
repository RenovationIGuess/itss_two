<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Faker\Factory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasUuids, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'email',
        'password',
        'name',
        'avatar'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'userProfile',
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    // Get called when we boot up the model?
    protected static function boot()
    {
        parent::boot();

        $faker = Factory::create('en_US');

        // Fires an event everytime a new user is created
        // Eloquent model event
        static::created(function ($user) use ($faker) {
            $user->name = $faker->name;
            $user->avatar = $faker->imageUrl();
        });
    }

    // A user can create many teams
    public function createdTeams(): HasMany
    {
        return $this->hasMany(Team::class);
    }

    public function joinedTeams()
    {
        return $this->belongsToMany(Team::class, 'team_user_pivot')
            ->withPivot('role', 'exp')
            ->withTimestamps();
    }

    public function createdTasks()
    {
        return $this->hasMany(TargetTask::class);
    }
}
