<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\LogoController;
use App\Http\Controllers\Api\V1\WalletController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — Logo Master
|--------------------------------------------------------------------------
| Prefix: /api/v1
| Auth: Laravel Sanctum (Bearer Token)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // === Public routes (không cần auth) ===
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // === Protected routes (cần Bearer Token) ===
    Route::middleware('auth:sanctum')->group(function () {

        // Auth
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        // Logos
        Route::post('/logos/generate', [LogoController::class, 'generate']);
        Route::get('/logos', [LogoController::class, 'index']);
        Route::get('/logos/{logo}', [LogoController::class, 'show']);
        Route::put('/logos/{logo}', [LogoController::class, 'update']);
        Route::delete('/logos/{logo}', [LogoController::class, 'destroy']);

        // Wallet
        Route::get('/wallet/balance', [WalletController::class, 'balance']);
        Route::post('/wallet/deposit', [WalletController::class, 'deposit']);
        Route::get('/wallet/transactions', [WalletController::class, 'transactions']);
    });
});
