<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ProfileController extends Controller
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
        if (!$request->expectsJson()) {
            return response(null, Response::HTTP_BAD_REQUEST);
        }

        $user = Auth::user();

        $image_64 = $request->input('nationalIDCard'); //your base64 encoded data
        $extension = explode('/', explode(':', substr($image_64, 0, strpos($image_64, ';')))[1])[1];   // .jpg .png .pdf
        $replace = substr($image_64, 0, strpos($image_64, ',') + 1);
        // find substring fro replace here eg: data:image/png;base64,
        $image = str_replace($replace, '', $image_64);
        $image = str_replace(' ', '+', $image);
        $imageName = Str::random(10) . '.' . $extension;
        Storage::disk('public')->put($imageName, base64_decode($image));
        $nationalIDCard = $imageName;

        if ($request->input('recommendation')) {
            $image_64 = $request->input('recommendation'); //your base64 encoded data
            $extension = explode('/', explode(':', substr($image_64, 0, strpos($image_64, ';')))[1])[1];   // .jpg .png .pdf
            $replace = substr($image_64, 0, strpos($image_64, ',') + 1);
            // find substring fro replace here eg: data:image/png;base64,
            $image = str_replace($replace, '', $image_64);
            $image = str_replace(' ', '+', $image);
            $imageName = Str::random(10) . '.' . $extension;
            Storage::disk('public')->put($imageName, base64_decode($image));
            $requestData['recommendation'] = $imageName;
            $recommendation = $imageName;
        } else {
            $recommendation = null;
        }

        $time = strtotime($request->input('dateOfBirth'));
        $newformat = date('Y-m-d', $time);
        if ($request->input('icdfTrainingFrom')) {
            $time = strtotime($request->input('icdfTrainingFrom'));
            $icdfTrainingFrom = date('Y-m-d', $time);
        } else {
            $icdfTrainingFrom = null;
        }
        if ($request->input('icdfTrainingTo')) {
            $time = strtotime($request->input('icdfTrainingTo'));
            $icdfTrainingTo = date('Y-m-d', $time);
        } else {
            $icdfTrainingTo = null;
        }

        if ($request->input('middleName')) {
            $middleName = $request->input('middleName');
        } else {
            $middleName = null;
        }
        if ($request->input('organization')) {
            $organization = $request->input('organization');
        } else {
            $organization = null;
        }
        if ($request->input('department')) {
            $department = $request->input('department');
        } else {
            $department = null;
        }
        if ($request->input('icdfProgramTitle')) {
            $icdfProgramTitle = $request->input('icdfProgramTitle');
        } else {
            $icdfProgramTitle = null;
        }
        if ($request->input('relatedJobDescription')) {
            $relatedJobDescription = $request->input('relatedJobDescription');
        } else {
            $relatedJobDescription = null;
        }

        $profile = [
            'uid' => $user->id,
            'givenName' => $request->input('givenName'),
            'middleName' =>  $middleName,
            'lastName' => $request->input('lastName'),
            'dateOfBirth' => $newformat,
            'gender' => $request->input('gender'),
            'phoneNumber' => $request->input('phoneNumber'),
            'homeAddress' => $request->input('homeAddress'),
            'constituency' => $request->input('constituency'),
            // 'emailAddress' => $request->input('emailAddress'),
            'jobPosition' => $request->input('jobPosition'),
            'organization' => $organization,
            'department' => $department,
            'objective' => $request->input('objective'),
            'icdfTraining' => $request->input('icdfTraining'),
            'icdfProgramTitle' => $icdfProgramTitle,
            'icdfTrainingFrom' => $icdfTrainingFrom,
            'icdfTrainingTo' => $icdfTrainingTo,
            'schoolName' => $request->input('schoolName'),
            'subject' => $request->input('subject'),
            'qualifications' => $request->input('qualifications'),
            'relatedJobExperience' => $request->input('relatedJobExperience'),
            'relatedJobDescription' => $relatedJobDescription,
            'programme' => $request->input('programme'),
            'nationalIDCard' => $nationalIDCard,
            'recommendation' => $recommendation,
        ];

        if ($request->input('created')) {
            $profile['created_at'] = $request->input('created');
        }

        $result = Profile::create($profile);

        $result = $result->refresh();
        return response($result, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Profile  $profile
     * @return \Illuminate\Http\Response
     */
    public function show(Profile $profile)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Profile  $profile
     * @return \Illuminate\Http\Response
     */
    public function edit(Profile $profile)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Profile  $profile
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Profile $profile)
    {
        if (!$request->expectsJson()) {
            return response(null, Response::HTTP_BAD_REQUEST);
        }

        if ($request->input('nationalIDCard')) {
            $image_64 = $request->input('nationalIDCard'); //your base64 encoded data
            $extension = explode('/', explode(':', substr($image_64, 0, strpos($image_64, ';')))[1])[1];   // .jpg .png .pdf
            $replace = substr($image_64, 0, strpos($image_64, ',') + 1);
            // find substring fro replace here eg: data:image/png;base64,
            $image = str_replace($replace, '', $image_64);
            $image = str_replace(' ', '+', $image);
            $imageName = Str::random(10) . '.' . $extension;
            Storage::disk('public')->put($imageName, base64_decode($image));
            $nationalIDCard = $imageName;
        } else {
            $nationalIDCard = null;
        }

        if ($request->input('recommendation')) {
            $image_64 = $request->input('recommendation'); //your base64 encoded data
            $extension = explode('/', explode(':', substr($image_64, 0, strpos($image_64, ';')))[1])[1];   // .jpg .png .pdf
            $replace = substr($image_64, 0, strpos($image_64, ',') + 1);
            // find substring fro replace here eg: data:image/png;base64,
            $image = str_replace($replace, '', $image_64);
            $image = str_replace(' ', '+', $image);
            $imageName = Str::random(10) . '.' . $extension;
            Storage::disk('public')->put($imageName, base64_decode($image));
            $requestData['recommendation'] = $imageName;
            $recommendation = $imageName;
        } else {
            $recommendation = null;
        }

        $time = strtotime($request->input('dateOfBirth'));
        $newformat = date('Y-m-d', $time);
        if ($request->input('icdfTrainingFrom')) {
            $time = strtotime($request->input('icdfTrainingFrom'));
            $icdfTrainingFrom = date('Y-m-d', $time);
        } else {
            $icdfTrainingFrom = null;
        }
        if ($request->input('icdfTrainingTo')) {
            $time = strtotime($request->input('icdfTrainingTo'));
            $icdfTrainingTo = date('Y-m-d', $time);
        } else {
            $icdfTrainingTo = null;
        }

        if ($request->input('middleName')) {
            $middleName = $request->input('middleName');
        } else {
            $middleName = null;
        }
        if ($request->input('organization')) {
            $organization = $request->input('organization');
        } else {
            $organization = null;
        }
        if ($request->input('department')) {
            $department = $request->input('department');
        } else {
            $department = null;
        }
        if ($request->input('icdfProgramTitle')) {
            $icdfProgramTitle = $request->input('icdfProgramTitle');
        } else {
            $icdfProgramTitle = null;
        }
        if ($request->input('relatedJobDescription')) {
            $relatedJobDescription = $request->input('relatedJobDescription');
        } else {
            $relatedJobDescription = null;
        }

        $user = Auth::user();

        Profile::where('uid', $user->id)->update([
            'givenName' => $request->input('givenName'),
            'middleName' =>  $middleName,
            'lastName' => $request->input('lastName'),
            'dateOfBirth' => $newformat,
            'gender' => $request->input('gender'),
            'phoneNumber' => $request->input('phoneNumber'),
            'homeAddress' => $request->input('homeAddress'),
            'constituency' => $request->input('constituency'),
            // 'emailAddress' => $request->input('emailAddress'),
            'jobPosition' => $request->input('jobPosition'),
            'organization' => $organization,
            'department' => $department,
            'objective' => $request->input('objective'),
            'icdfTraining' => $request->input('icdfTraining'),
            'icdfProgramTitle' => $icdfProgramTitle,
            'icdfTrainingFrom' => $icdfTrainingFrom,
            'icdfTrainingTo' => $icdfTrainingTo,
            'schoolName' => $request->input('schoolName'),
            'subject' => $request->input('subject'),
            'qualifications' => $request->input('qualifications'),
            'relatedJobExperience' => $request->input('relatedJobExperience'),
            'relatedJobDescription' => $relatedJobDescription,
            'programme' => $request->input('programme'),
            // 'nationalIDCard' => $nationalIDCard,
            // 'recommendation' => $recommendation,
        ]);

        if ($nationalIDCard) {
            $profile = DB::table('profiles')->where('uid', $user->id)->first();
            Storage::disk('public')->delete($profile->nationalIDCard);
            Profile::where('uid', $user->id)->update([
                'nationalIDCard' => $nationalIDCard,
            ]);
        }

        if ($recommendation) {
            $profile = DB::table('profiles')->where('uid', $user->id)->first();
            Storage::disk('public')->delete($profile->recommendation);
            Profile::where('uid', $user->id)->update([
                'recommendation' => $recommendation,
            ]);
        }

        return response(null, Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Profile  $profile
     * @return \Illuminate\Http\Response
     */
    public function destroy(Profile $profile)
    {
        //
    }

    public function deleteRecommendation()
    {
        $user = Auth::user();
        $profile = DB::table('profiles')->where('uid', $user->id)->first();
        Storage::disk('public')->delete($profile->recommendation);
        Profile::where('uid', $user->id)->update([
            'recommendation' => null,
        ]);
    }
}
