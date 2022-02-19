<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use App\Http\Middleware\Permission;
use App\Http\Middleware\Role;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [App\Http\Controllers\HomeController::class, 'index']);

// Auth::routes();
// Auth::routes(['verify' => true]);
Auth::routes(['verify' => true]);

Route::get('/admin', 'App\Http\Controllers\AdminController@index')->middleware(['verified', 'role:admin']);
Route::get('/users', 'App\Http\Controllers\AdminController@getUsers')->middleware(['verified', 'role:admin']);
Route::get('/candidates', 'App\Http\Controllers\AdminController@getCandidates')->middleware(['verified', 'role:admin']);
Route::get('/export', 'App\Http\Controllers\AdminController@getExport')->middleware(['verified', 'role:admin']);
Route::get('/member', 'App\Http\Controllers\MemberController@index')->middleware(['verified', 'role:member']);
Route::post('/profile', 'App\Http\Controllers\ProfileController@store')->middleware(['verified', 'role:member']);
Route::patch('/profile/{uid}', 'App\Http\Controllers\ProfileController@update')->middleware(['verified', 'role:member']);
Route::delete('/profile/recommendation', 'App\Http\Controllers\ProfileController@deleteRecommendation')->middleware(['verified', 'role:member']);
Route::patch('/user/password', 'App\Http\Controllers\UserController@changePassword')->middleware(['verified']);
Route::delete('/user', 'App\Http\Controllers\UserController@deleteUser')->middleware(['verified', 'role:member']);

Route::get('/email/verify', function () {
    return view('auth.verify');
})->middleware('auth')->name('verification.notice');

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();

    return redirect('/');
})->middleware(['auth', 'signed'])->name('verification.verify');

Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();

    return back()->with('message', 'Verification link sent!');
})->middleware(['auth', 'throttle:6,1'])->name('verification.send');

Route::patch('/score', 'App\Http\Controllers\RatingController@update')->middleware(['verified', 'role:admin']);
