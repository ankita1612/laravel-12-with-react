
✅ 1. Install & Setup Sanctum (if not done)
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
✅ 2. Add Middleware (VERY IMPORTANT)

//////Open app/Http/Kernel.php   /this removed
open bootstrap/app.php

Inside api middleware group, add:

\Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,

Example:

'api' => [
    \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    'throttle:api',
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
],
✅ 3. Configure .env
SESSION_DRIVER=cookie
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:5173
✅ 4. Configure config/cors.php
'supports_credentials' => true,
'allowed_origins' => ['http://localhost:5173'],
✅ 5. Use web.php for login (NOT api.php)

👉 This is where most people go wrong.

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

Route::post('/login', function (Request $request) {
    if (!Auth::attempt($request->only('email', 'password'))) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    $request->session()->regenerate();

    return response()->json([
        'user' => Auth::user()
    ]);
});
✅ 6. Protect routes
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
🔥 What /sanctum/csrf-cookie actually does

When you call:

await apiClient.get("/sanctum/csrf-cookie");

Laravel automatically:

Sets XSRF-TOKEN cookie
Sets session cookie
Prepares CSRF protection

👉 No controller needed
👉 No route needed
👉 It’s built-in