<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function deleteUser()
    {
        $user = Auth::user();
        $user->delete();
        return response(null, Response::HTTP_OK);
    }

    public function changePassword(Request $request)
    {
        $user = Auth::user();
        $currentPassword = $request->input('currentPassword');
        $newPassword = $request->input('newPassword');

        $error = null;

        if (!Hash::check($currentPassword, $user->password)) {
            $error['notMatch'] = true;
        }

        if (strlen($newPassword) < 8) {
            $error['lenghtError'] = true;
        }

        if ($error) {
            return response($error, Response::HTTP_FORBIDDEN);
        }

        $user->update(['password' => Hash::make($newPassword)]);
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response(null, Response::HTTP_OK);
    }
}
