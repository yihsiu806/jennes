<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;

use App\Models\Profile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    // protected $redirectTo = RouteServiceProvider::HOME;

    // protected function redirectTo()
    // {
    //     $permission = Auth::user()->permission;
    //     switch ($permission) {
    //         case 'admin':
    //             return '/admin';
    //             break;
    //         case 'member':
    //             return '/member';
    //             break;

    //         default:
    //             return '/member';
    //             break;
    //     }
    // }

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    // protected function authenticated(Request $request, $user)
    // {
    //     $permission = $user->permission;
    //     switch ($permission) {
    //         case 'admin':
    //             return redirect()->route('admin');
    //             break;
    //         case 'member':
    //             return redirect()->route('member');
    //             break;

    //         default:
    //             return redirect()->route('member');
    //             break;
    //     }
    // }

    protected function authenticated(Request $request, $user)
    {
        if ($user->permission == 'admin') {
            return redirect('/admin');
        } else if ($user->permission == 'member') {
            return redirect('/member');
        } else {
            return redirect('/member');
        }
    }
}
