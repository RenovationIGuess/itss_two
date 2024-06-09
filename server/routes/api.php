<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TargetController;
use App\Http\Controllers\TeamController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Normal auth
Route::controller(AuthController::class)->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('signin', 'signin');
        Route::post('signout', 'signout');
        Route::post('signup', 'signup');
        Route::post('refresh', 'refresh');
        Route::get('me', 'me');
    });
});

Route::prefix('teams')->group(function () {
    Route::prefix('targets')->group(function () {
        Route::controller(TargetController::class)->group(function () {
            Route::get('/', 'index');
            Route::get('{targetId}', 'show');
            Route::post('/', 'store');
            Route::patch('/{targetId}', 'update');
            Route::delete('/{targetId}', 'destroy');
        });
    });

    Route::controller(TeamController::class)->group(function () {
        Route::get('/', 'index');
        Route::get('/{teamId}/role', 'getAuthUserRole');
        Route::get('{teamId}', 'show');
        Route::post('/', 'store');
        Route::post('join', 'join');
    });
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
