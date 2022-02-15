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
        $data = [
            'user' => $user,
            'profile' => $profile,
        ];
        return view('member', $data);
    }
}

function write_log($log_msg)
{
    $log_filename = "/home/yihsiu/logs";
    if (!file_exists($log_filename)) {
        mkdir($log_filename, 0777, true);
    }
    $log_file_data = $log_filename . '/debug.log';
    file_put_contents($log_file_data, $log_msg . "\n", FILE_APPEND);
}
