<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MemberController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $user = Auth::user();
        $profile = DB::table('profiles')->where('uid', $user->id)->first();
        if ($profile) {
            $profile->nationalIDCard = '/storage/' . $profile->nationalIDCard;
        }

        if ($profile && $profile->recommendation) {
            $profile->recommendation = '/storage/' . $profile->recommendation;
        }

        if ($profile) {
            array_walk_recursive($profile, function (&$item, $key) {
                $item = addslashes($item);
                $item = trim(preg_replace('/\\n/', ' ', $item));
            });
        }

        $data = [
            'user' => $user,
            'profile' => $profile,
        ];

        return view('member', $data);
    }
}
