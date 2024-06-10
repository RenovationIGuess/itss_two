<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index(Request $request)
    {
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
        ]);

        $data['join_code'] = Str::random(6) . 'te';

        /** @var \App\Models\User $user */
        $user = auth()->user();

        /** @var \App\Models\Team $team */
        $team = $user->createdTeams()->create($data);

        // Create a pivot instance
        $team->members()->attach($user->id, [
            'role' => 'admin',
            'exp' => 0,
        ]);

        return response()->json($team);
    }

    public function getAuthUserRole(Request $request, $teamId)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        /** @var \App\Models\Team $team */
        $team = $user->joinedTeams()->findOrFail($teamId);

        $role = $team->members()
            ->where('user_id', $user->id)
            ->first()
            ->pivot
            ->role;

        return response()->json($role);
    }

    public function show(Request $request, $teamId)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        /** @var \App\Models\Team $team */
        $team = $user->joinedTeams()->findOrFail($teamId);

        return response()->json($team);
    }

    public function join(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
        ]);

        /** @var \App\Models\User $user */
        $user = auth()->user();

        /** @var \App\Models\Team $team */
        $team = Team::findOrFail($data['name']);

        if (!$team->members()->where('user_id', $user->id)->exists()) {
            // Create a pivot instance
            $team->members()->attach($user->id, [
                'role' => 'member',
                'exp' => 0,
            ]);
        }

        return response()->json($team);
    }

    public function getLeaderBoard(Request $request, $teamId)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        /** @var \App\Models\Team $team */
        $team = $user->joinedTeams()->findOrFail($teamId);

        $members = $team->members()->with(['user'])->get();

        return response()->json($members);
    }
}
