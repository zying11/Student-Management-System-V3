<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CenterProfileController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubjectController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::middleware('auth:sanctum')->group(function () {
    Route::get('logout', [AuthController::class, 'logout']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::apiResource('/users', UserController::class);

});


Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);

Route::post('/add-lesson', [LessonController::class, 'addNewLesson']);
Route::post('/update-lesson', [LessonController::class, 'updateLesson']);
Route::get('lessons', [LessonController::class, 'index']);

Route::get('center-profile', [CenterProfileController::class, 'index']);
Route::post('/update-center-profile', [CenterProfileController::class, 'update']);

Route::get('subjects', [SubjectController::class, 'index']);
Route::post('add-subject', [SubjectController::class, 'addSubject']);

Route::apiResource('/users', UserController::class);
Route::apiResource('/students', StudentController::class);
Route::apiResource('/invoices', InvoiceController::class); 