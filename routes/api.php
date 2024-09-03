<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CenterProfileController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\AdminController;

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

    // Route::apiResource('/users', UserController::class);

});


Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
// Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

Route::post('/add-lesson', [LessonController::class, 'addNewLesson']);
Route::post('/update-lesson', [LessonController::class, 'setLessonTime']);
Route::put('/edit-lesson/{id}', [LessonController::class, 'updateLesson']);
Route::delete('/delete-lesson/{id}', [LessonController::class, 'destroy']);
Route::get('lessons', [LessonController::class, 'getLessons']);
Route::get('/timetable-lessons', [LessonController::class, 'getTimetableLessons']);

Route::get('rooms', [RoomController::class, 'index']);

Route::get('center-profile', [CenterProfileController::class, 'index']);
Route::post('/update-center-profile', [CenterProfileController::class, 'update']);

Route::get('subjects', [SubjectController::class, 'index']);
Route::post('add-subject', [SubjectController::class, 'addSubject']);

Route::get('students', [AttendanceController::class, 'getStudentsList']);
Route::post('/mark-attendance', [AttendanceController::class, 'markAttendance']);

// Route::apiResource('/users', UserController::class);
// Route to fetch the list of all users
Route::get('/users', [UserController::class, 'index']);
// Route to store a new user details
Route::post('/users', [UserController::class, 'store']);
// Route to fetch specific user details by ID
Route::get('/users/{id}', [UserController::class, 'show']);
// Route to update specific user details by ID
Route::put('/users/{id}', [UserController::class, 'update']);

Route::apiResource('/students', StudentController::class);
Route::apiResource('/invoices', InvoiceController::class);
Route::apiResource('/students/{student}/enrollments', EnrollmentController::class);

// // Password Reset Routes
// Route::get('password/reset/{token}', [PasswordResetController::class, 'showResetForm'])->name('password.reset');
// Route::post('password/reset', [PasswordResetController::class, 'reset'])->name('password.update');
// Route::post('password/email', [PasswordResetController::class, 'sendResetLinkEmail'])->name('password.email');
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [PasswordResetController::class, 'reset']);

// // Add this route for the reset form if you plan to use a web route to handle the reset password form
Route::get('/reset-password/{token}', function ($token) {
    return redirect()->to('http://localhost:3000/reset-password/' . $token);
})->name('password.reset');

// Route::apiResource('/admins', AdminController::class);
// Route to fetch the list of all admins
Route::get('/admins', [AdminController::class, 'index']);
// Route to store a new admin and associated user details
Route::post('/admins', [AdminController::class, 'store']);
// Route to fetch specific admin details by ID
Route::get('/admins/{id}', [AdminController::class, 'show']);
// Route to update specific admin details by ID
Route::put('/admins/{id}', [AdminController::class, 'update']);
// Route to delete specific admin details and the associated user account by ID
Route::delete('/admins/{id}', [AdminController::class, 'destroy']);