<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TaskApproveRequestController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->validateTeamTargetTask($request);
            return $next($request);
        });
    }

    public function index(Request $request)
    {
        /** @var \App\Models\TargetTask $task */
        $task = $request->task;

        $query = $task->taskApproveRequests()->with(['user']);

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%');
            });
        }

        if ($request->has('status')) {
            $status = $request->input('status');
            $query->where('status', $status);
        }

        if ($request->has('sort_type')) {
            $sortType = $request->input('sort_type');
            switch ($sortType) {
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

        $requests = $query->get();
        return response()->json($requests);
    }

    public function store(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        /** @var \App\Models\Team $team */
        $team = $request->team;

        // $auth_user_team_profile = $team->members()->where('user_id', $user->id)->first();
        // $auth_user_team_role = $auth_user_team_profile->pivot->role;

        /** @var \App\Models\TargetTask $task */
        $task = $request->task;

        // Only admin can approve the request
        // if ($auth_user_team_role !== 'admin') {
        //     return response()->json(['message' => 'Forbidden'], 403);
        // }

        $task_creator_role = $team->members()->where('user_id', $task->user_id)->first()->pivot->role;

        // If the task is not created by an admin then abort the request
        if ($task_creator_role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validate([
            'evidence' => 'required|string',
        ]);

        $data['user_id'] = $user->id;

        $approve_request = $task->taskApproveRequests()->create($data);

        return $this->eagerLoad($approve_request);
    }

    public function updateEvidence(Request $request, $approveRequestId)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        /** @var \App\Models\TargetTask $task */
        $task = $request->task;

        /** @var \App\Models\TaskApproveRequest $approve_request */
        $approve_request = $task->taskApproveRequests()->findOrFail($approveRequestId);

        if ($user->id !== $approve_request->user_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validate([
            'evidence' => 'required|string',
        ]);

        $approve_request->update($data);

        return $this->eagerLoad($approve_request);
    }

    public function approveRequest(Request $request, $approveRequestId)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        /** @var \App\Models\Team $team */
        $team = $request->team;

        /** @var \App\Models\Target $target */
        $target = $request->target;

        $auth_user_team_profile = $team->members()->where('user_id', $user->id)->first();
        $auth_user_team_role = $auth_user_team_profile->pivot->role;

        // If the auth user is not the admin then abort the request
        if ($auth_user_team_role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Only the task created by the admin can be add exp
        /** @var \App\Models\TargetTask $task */
        $task = $request->task;

        // If this is not the task created by the admin then abort the request
        if ($task->user_id !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        /** @var \App\Models\TaskApproveRequest $approve_request */
        $approve_request = $task->taskApproveRequests()->findOrFail($approveRequestId);

        $data = $request->validate([
            'status' => 'required|in:approved,rejected',
        ]);

        DB::transaction(function () use ($team, $target, $task, &$approve_request, $data) {
            $approve_request->update($data);

            $requester = $approve_request->user()->first();

            // When a request is approved, add exp to requester's team profile
            if ($data['status'] === 'approved') {
                $exp = $task->exp;

                $requester_team_profile = $team->members()->where('user_id', $requester->id)->first();

                $team->members()->updateExistingPivot(
                    $requester->id,
                    [
                        'exp' => $requester_team_profile->pivot->exp + $exp
                    ]
                );
            }

            // Check if the target task is completed -> get exp for all the members
            $members = $team->members()->get();
            $targetTasks = $target->tasks()->get();
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

            if ($allTasksCompleted) {
                $exp = $target->exp;

                foreach ($members as $member) {
                    $team->members()->updateExistingPivot(
                        $member->id,
                        [
                            'exp' => $member->pivot->exp + $exp
                        ]
                    );
                }
            }
        });

        return $this->eagerLoad($approve_request);
    }

    public function destroy(Request $request, $approveRequestId)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        // The request can be delete by the admin and the requester
        /** @var \App\Models\Team $team */
        $team = $request->team;

        /** @var \App\Models\TargetTask $task */
        $task = $request->task;

        /** @var \App\Models\TaskApproveRequest $approve_request */
        $approve_request = $task->taskApproveRequests()->findOrFail($approveRequestId);

        $auth_user_team_profile = $team->members()->where('user_id', $user->id)->first();
        $auth_user_team_role = $auth_user_team_profile->pivot->role;

        if ($auth_user_team_role !== 'admin' && $user->id !== $approve_request->user_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $approve_request->delete();

        return response()->json(['message' => 'Approve request deleted successfully']);
    }

    protected function eagerLoad($approve_request)
    {
        $approve_request->load(['user']);

        return response()->json($approve_request);
    }

    protected function validateTeamTargetTask(Request $request)
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

        $taskId = $request->input('task_id');

        if (!$taskId) {
            return response()->json([
                'message' => 'Task ID is required',
            ], 400);
        }

        /** @var \App\Models\TargetTask $task */
        $task = $target->tasks()->findOrFail($taskId);

        $request->merge(compact('team', 'target', 'task'));
    }
}
