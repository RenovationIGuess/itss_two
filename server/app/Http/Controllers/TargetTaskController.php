<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TargetTaskController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->validateTeamTarget($request);
            return $next($request);
        });
    }

    public function index(Request $request)
    {
        /** @var \App\Models\Target $target */
        $target = $request->target;

        $query = $target->tasks()->with(['user']);

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('title', 'like', "%$search%");
        }

        if ($request->has('date')) {
            $date = $request->input('date');
            $query->whereDate('due', $date);
        }

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

        $tasks = $query->get();
        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        /** @var \App\Models\Target $target */
        $target = $request->target;

        $data = $request->validate([
            'title' => 'required|string',
            'due' => 'nullable|date',
            'description' => 'nullable|string',
            'exp' => 'sometimes|integer',
        ]);
        $data['user_id'] = $user->id;

        $task = $target->tasks()->create($data);

        return $this->eagerLoad($task);
    }

    public function show(Request $request, $taskId)
    {
        /** @var \App\Models\Target $target */
        $target = $request->target;

        $task = $target->tasks()->findOrFail($taskId);

        return $this->eagerLoad($task);
    }

    public function update(Request $request, $taskId)
    {
        $data = $request->validate([
            'title' => 'sometimes|string',
            'due' => 'nullable|sometimes|date',
            'description' => 'nullable|sometimes|string',
            'exp' => 'sometimes|integer',
        ]);

        /** @var \App\Models\Team $target */
        $target = $request->target;

        $task = $target->tasks()->findOrFail($taskId);

        $task->update($data);

        return $this->eagerLoad($task);
    }

    public function destroy(Request $request, $taskId)
    {
        /** @var \App\Models\Team $target */
        $target = $request->target;

        $task = $target->tasks()->findOrFail($taskId);

        $task->delete();

        return response()->json([
            'message' => 'Task deleted successfully',
        ]);
    }

    protected function eagerLoad($task)
    {
        $task->load(['user']);

        return response()->json($task);
    }

    protected function validateTeamTarget(Request $request)
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

        $targetId = $request->input('target_id');

        if (!$targetId) {
            return response()->json([
                'message' => 'Target ID is required',
            ], 400);
        }

        /** @var \App\Models\Target $target */
        $target = $team->targets()->findOrFail($targetId);

        $request->merge(compact('team', 'target'));
    }
}
