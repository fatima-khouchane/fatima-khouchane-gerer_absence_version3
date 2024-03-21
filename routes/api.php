<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmailController;
use App\Http\Controllers\ModifierAbsenceController;
use App\Http\Controllers\SanctionController;
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
Route::get('/stagiaires/{filiere}/{groupe}/{promotion}', [SurveillanceController::class, 'getStagiaireByFilter']);
Route::post('/absences', [SurveillanceController::class, 'saveAbsence']);
Route::get('/absences/existUpdate/{filiere}/{groupe}/{date}', [SurveillanceController::class, 'checkAbsencesExistence']);

Route::get('/stagiaires/{filiere}/{groupe}', [SurveillanceController::class, 'getStagiaireByFilterUpdate']);

Route::put('/absences/update', [SurveillanceController::class, 'updateAbsence']);
Route::get('/sanctions', [SanctionController::class, 'getSanctions']);

Route::get('/showSanction', [SanctionController::class, 'showSanction']);
Route::get('/getStagiairesWithAbsencesAndSanctions', [SanctionController::class, 'getStagiairesWithAbsencesAndSanctions']);


    Route::get('/filieres/{id}', [SurveillanceController::class, 'getFiliereById']);
    Route::get('/groupes/{id}', [SurveillanceController::class, 'getGroupeById']);


    Route::post('/send-email', [EmailController::class,'sendEmail']);


    Route::get('/getStagiairesDashboard', [SurveillanceController::class, 'getStagiairesDashboard']);

    Route::get('/generateReport', [SurveillanceController::class, 'generateReport']);


    Route::get('/dashboard_statistique', [SurveillanceController::class, 'dashboard_statistique']);
Route::get('/absences/exist/{filiere}/{groupe}/{date}', [SurveillanceController::class, 'checkAbsencesExistenceSaisir']);
