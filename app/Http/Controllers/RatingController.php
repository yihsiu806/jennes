<?php

namespace App\Http\Controllers;

use App\Models\Rating;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

use function App\Http\Controllers\write_log as ControllersWrite_log;
use function App\write_log as AppWrite_log;

class RatingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Rating  $rating
     * @return \Illuminate\Http\Response
     */
    public function show(Rating $rating)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Rating  $rating
     * @return \Illuminate\Http\Response
     */
    public function edit(Rating $rating)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Rating  $rating
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Rating $rating)
    {
        $user = Auth::user();
        $score = $request->input('score');
        $candidate = $request->input('candidate');
        if ($score < 0 || $score > 5) {
            return response(["message" => "Score beyond range: " . $score], Response::HTTP_BAD_REQUEST);
        }
        $candidateExist = Profile::where('uid', $candidate)->first();
        if (!$candidateExist) {
            return response(["message" => "Candidate not exist."], Response::HTTP_BAD_REQUEST);
        }

        $record = Rating::where('candidate', $candidate)->where('committee', $user->id)->first();
        if (!$record) {
            $newRecord = Rating::create([
                'candidate' => $candidate,
                'score' => $score,
                'committee' => $user->id
            ]);
            $newRecord = $newRecord->refresh();
        } else {
            $record->update([
                'score' => $score
            ]);
        }
        return response(null, Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Rating  $rating
     * @return \Illuminate\Http\Response
     */
    public function destroy(Rating $rating)
    {
        //
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
