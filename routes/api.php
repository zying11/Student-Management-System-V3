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
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\TeacherSubjectController;
use App\Http\Controllers\ParentsController;

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
// Route::post('register', [AuthController::class, 'register']);
// Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

Route::post('/add-lesson', [LessonController::class, 'addNewLesson']);
Route::post('/set-lesson-time', [LessonController::class, 'setLessonTime']);
Route::put('/edit-lesson/{id}', [LessonController::class, 'updateLesson']);
Route::delete('/delete-lesson/{id}', [LessonController::class, 'deleteLesson']);
Route::get('lessons', [LessonController::class, 'getLessons']);
Route::get('/timetable-lessons', [LessonController::class, 'getTimetableLessons']);

Route::get('rooms', [RoomController::class, 'index']);
Route::get('/get-room/{id}', [RoomController::class, 'getRoom']);
Route::put('/edit-room/{id}', [RoomController::class, 'updateRoom']);
Route::post('/add-room', [RoomController::class, 'addNewRoom']);
Route::delete('/rooms/{id}', [RoomController::class, 'deleteRoom']);

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

Route::apiResource('/invoices', InvoiceController::class);


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

// Route to fetch the list of all teachers
Route::get('/teachers', [TeacherController::class, 'index']);
// Route to store a new teacher and associated user details
Route::post('/teachers', [TeacherController::class, 'store']);
// Route to fetch specific teacher details by ID
Route::get('/teachers/{id}', [TeacherController::class, 'show']);
// Route to update specific teacher details by ID
Route::put('/teachers/{id}', [TeacherController::class, 'update']);
// Route to delete specific teacher details and the associated user account by ID
Route::delete('/teachers/{id}', [TeacherController::class, 'destroy']);


// Route to store subjects teaching for a teacher
Route::post('/teachers/subjects', [TeacherSubjectController::class, 'store']);
// Route to update subjects teaching for a specific teacher
Route::put('/teachers/{id}/subjects', [TeacherSubjectController::class, 'update']);
// Route to get subjects teaching assigned to a specific teacher
Route::get('/teachers/{id}/subjects', [TeacherSubjectController::class, 'show']);

// Route::apiResource('/students', StudentController::class);
// Route to fetch the list of all students
Route::get('/students', [StudentController::class, 'index']);
// Route to store a new student 
Route::post('/students', [StudentController::class, 'store']);
// Route to fetch specific student details by ID
Route::get('/students/{id}', [StudentController::class, 'show']);
// Route to update specific student details by ID
Route::put('/students/{id}', [StudentController::class, 'update']);
// Route to delete specific student details by ID
Route::delete('/students/{id}', [StudentController::class, 'destroy']);

// Additional routes for managing the relationship
Route::post('students/{id}/parents', [StudentController::class, 'addParents']);
Route::delete('students/{id}/parents/{parent}', [StudentController::class, 'removeParent']);
Route::get('students/{id}/parents', [StudentController::class, 'getParents']);

// Route::apiResource('/parents', ParentController::class);
// Route to fetch the list of all parents
Route::get('/parents', [ParentsController::class, 'index']);
// Route to store a new parent 
Route::post('/parents', [ParentsController::class, 'store']);
// Route to fetch specific parent details by ID
Route::get('/parents/{id}', [ParentsController::class, 'show']);
// Route to update specific parent details by ID
Route::put('/parents/{id}', [ParentsController::class, 'update']);

// Route::apiResource('/enrollments', EnrollmentController::class);
// Route to fetch the list of all enrollments
Route::get('/enrollments', [EnrollmentController::class, 'index']);
// Route to store a new enrollment
Route::post('/enrollments', [EnrollmentController::class, 'store']);
// Route to retrieve specific enrollment details by ID
Route::get('/enrollments/{id}', [EnrollmentController::class, 'show']);
// Route to update specific enrollment details by ID
Route::put('/enrollments/{id}', [EnrollmentController::class, 'update']);
// Route to delete specific enrollment details by ID
Route::delete('/enrollments/{id}', [EnrollmentController::class, 'destroy']);