<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes — Logo Master
|--------------------------------------------------------------------------
| SPA: React build nằm tại public/build/
| Mọi request không phải API/asset sẽ trả về SPA index.html
| để React Router xử lý client-side routing.
|--------------------------------------------------------------------------
*/

// SPA fallback: trả về React index.html cho tất cả các route
// Route API (/api/*) đã được xử lý bởi routes/api.php nên không bị ảnh hưởng
Route::fallback(function () {
    $path = public_path('build/index.html');
    if (!file_exists($path)) {
        abort(404, 'SPA not built. Run: cd frontend && npm run build');
    }
    return response()->file($path, ['Content-Type' => 'text/html']);
});
