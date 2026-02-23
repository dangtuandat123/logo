<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes — Logo Master
|--------------------------------------------------------------------------
| - Trang chủ: serve Laravel welcome
| - /app/{any}: serve React SPA index.html (catch-all cho client-side routing)
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return view('welcome');
});

// SPA catch-all: mọi route /app/* sẽ trả về React SPA index.html
Route::get('/app/{any?}', function () {
    return file_get_contents(public_path('app/index.html'));
})->where('any', '.*');
