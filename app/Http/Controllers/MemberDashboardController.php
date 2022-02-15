<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MemberDashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $user = Auth::user();
        $profile = DB::table('profiles')->where('uid', $user->id)->first();
        $data = [
            'user' => $user,
            'profile' => $profile,
        ];
        return view('member', $data);
    }
}
