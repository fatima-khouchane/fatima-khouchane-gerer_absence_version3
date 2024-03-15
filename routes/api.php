<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SurveillanceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Symfony\Component\HttpKernel\EventListener\SurrogateListener;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


// Route::post('/login', [AuthController::class, 'login']);


Route::controller(AuthController::class)->group(function(){
    // Route::post('register','register');
    Route::post('login','login');
    Route::post('logout','logout');

    Route::get('me','userDetails');
});


Route::get('/filieres', [SurveillanceController::class, 'getFiliere']);
Route::get('/groupes', [SurveillanceController::class, 'getGroupe']);
Route::get('/stagiaires/{filiere}/{groupe}', [SurveillanceController::class, 'getStagiaireByFilter']);
Route::post('/absences', [SurveillanceController::class, 'saveAbsence']);
Route::get('/absences/exist/{filiere}/{groupe}/{date}', [SurveillanceController::class, 'checkAbsencesExistence']);
