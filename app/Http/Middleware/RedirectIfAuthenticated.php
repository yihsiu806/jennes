<?php

namespace App\Http\Middleware;

use App\Providers\RouteServiceProvider;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @param  string|null  ...$guards
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next, ...$guards)
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {

                $permission = Auth::user()->permission;

                switch ($permission) {
                    case 'admin':
                        return redirect('/admin');
                        break;
                    case 'member':
                        return redirect('/member');
                        break;

                    default:
                        return redirect('/');
                        // auth()->logout();
                        // return route('web.welcome');
                        break;
                }
            }
        }

        return $next($request);
    }

    private function debug_to_console($data)
    {
        $output = $data;
        if (is_array($output))
            $output = implode(',', $output);

        echo "<script>console.log('Debug Objects: " . $output . "' );</script>";
    }

    // public function handle($request, Closure $next, $guard = null)
    // {
    //     if (Auth::guard($guard)->check()) {
    //         $permission = Auth::user()->permission;

    //         switch ($permission) {
    //             case 'admin':
    //                 return redirect('/admin');
    //                 break;
    //             case 'member':
    //                 return redirect('/member');
    //                 break;

    //             default:
    //                 return redirect('/member');
    //                 break;
    //         }
    //     }
    //     return $next($request);
    // }
}
