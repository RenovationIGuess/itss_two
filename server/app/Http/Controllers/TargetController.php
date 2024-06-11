<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TargetController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->validateTeam($request);
            return $next($request);
        });
    }

    public function index(Request $request)
    {
        /** @var \App\Models\Team $team */
        $team = $request->team;

        $query = $team->targets();

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('title', 'like', "%$search%");
        }

        if ($request->has('date')) {
            $date = $request->input('date');
            $query->where('due', 'like', "%$date%");
        }

        // if ($request->has('status')) {

        // }

        if ($request->has('sort_type')) {
            $sort_type = $request->input('sort_type');
            switch ($sort_type) {
                case 'latest':
                    $query->latest();
                    break;
                case 'oldest':
                    $query->oldest();
                    break;
                default:
                    $query->latest();
                    break;
            }
        } else {
            $query->latest();
        }

        $targets = $query->get();
        return response()->json($targets);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'due' => 'nullable|date',
            'description' => 'nullable|string',
            'exp' => 'sometimes|integer',
        ]);

        $target = $request->team->targets()->create($data);

        return response()->json($target);
    }

    public function show(Request $request, $targetId)
    {
        /** @var \App\Models\Team $team */
        $team = $request->team;

        $target = $team->targets()->findOrFail($targetId);

        return response()->json($target);
    }

    public function update(Request $request, $targetId)
    {
        $data = $request->validate([
            'title' => 'sometimes|string',
            'due' => 'nullable|sometimes|date',
            'description' => 'nullable|sometimes|string',
            'exp' => 'sometimes|integer',
        ]);

        /** @var \App\Models\Team $team */
        $team = $request->team;

        $target = $team->targets()->findOrFail($targetId);

        $target->update($data);

        return response()->json($target);
    }

    public function destroy(Request $request, $targetId)
    {
        /** @var \App\Models\Team $team */
        $team = $request->team;

        $target = $team->targets()->findOrFail($targetId);

        $target->delete();

        return response()->json([
            'message' => 'Target deleted successfully',
        ]);
    }

    protected function validateTeam(Request $request)
    {
        $teamId = $request->input('team_id');

        if (!$teamId) {
            return response()->json([
                'message' => 'Team ID is required',
            ], 400);
        }

        /** @var \App\Models\User $user */
        $user = auth()->user();

        /** @var \App\Models\Team $team */
        $team = $user->joinedTeams()->findOrFail($teamId);

        $request->merge(compact('team'));
    }
}
