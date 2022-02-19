<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Profile;
use App\Models\User;
use Symfony\Component\HttpFoundation\Response;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $me = Auth::user();
        $totalUsers = DB::table('users')->count();
        $totalCandidates = DB::table('profiles')->count();
        // $programme = DB::table('profiles')->groupBy('constituency')->get();
        $programme = DB::table('profiles')
            ->select('programme', DB::raw('count(*) as total'))
            ->groupBy('programme')
            ->get();
        $gender = DB::table('profiles')
            ->select('gender', DB::raw('count(*) as total'))
            ->groupBy('gender')
            ->get();
        $job = DB::table('profiles')
            ->select('jobPosition', DB::raw('count(*) as total'))
            ->groupBy('jobPosition')
            ->get();
        $constituency = DB::table('profiles')
            ->select('constituency', DB::raw('count(*) as total'))
            ->groupBy('constituency')
            ->get();
        $age = DB::table('profiles')
            ->selectRaw("TIMESTAMPDIFF(YEAR, DATE(dateOfBirth), current_date) AS age, count(*) as total")
            ->groupBy('age')
            ->get();

        $stat = [
            'totalUsers' => $totalUsers,
            'totalCandidates' => $totalCandidates,
            'programme' => $programme,
            'gender' => $gender,
            'job' => $job,
            'constituency' => $constituency,
            'age' => $age
        ];

        $users = User::orderBy('id', 'desc')
            ->paginate(15);

        $candidates = Profile::orderBy('uid', 'desc')
            ->paginate(15);

        $data = [
            'me' => $me,
            'stat' => $stat,
            'users' => $users,
            'candidates' => $candidates
        ];
        return view('admin', $data);
    }

    public function getUsers(Request $request)
    {
        $limit = $request->limit ?? 100;
        $users = User::orderBy('id', 'desc')
            ->paginate($limit);

        return response($users, Response::HTTP_OK);
    }

    public function getCandidates(Request $request)
    {
        $limit = $request->limit ?? 100;
        // $candidates = Profile::orderBy('uid', 'desc')
        //     ->paginate($limit);

        $committee = Auth::user()->id;

        $candidates = DB::table('users')
            ->join('profiles', 'users.id', '=', 'profiles.uid')
            ->leftJoin('ratings', function ($join) use ($committee) {
                $join->on('profiles.uid', '=', 'ratings.candidate');
                $join->on('ratings.committee', '=', DB::raw("'" . $committee . "'"));
            })
            ->orderBy('profiles.uid', 'desc')
            ->select('profiles.*', 'users.email', 'ratings.score')
            ->paginate($limit);

        return response($candidates, Response::HTTP_OK);
    }

    public function getExport(Request $request)
    {
        write_log('aaa');
        $result = DB::table('users')
            ->join('profiles', 'users.id', '=', 'profiles.uid')
            ->leftJoin('ratings', function ($join) {
                $join->on('profiles.uid', '=', 'ratings.candidate');
            })
            ->orderBy('profiles.uid', 'desc')
            ->select('profiles.*', 'users.email', DB::raw('AVG(ratings.score) AS score'))
            ->get();

        write_log('bbb');
        foreach ($result as $r) {
            write_log($r->uid);
        }

        write_log('ccc');
        return response($result, Response::HTTP_OK);
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
