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
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\ParentsController;
use App\Http\Controllers\StudyLevelController;
use App\Http\Controllers\RecordPaymentController;
use App\Http\Controllers\FeedbackController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TeacherDashboardController;

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

Route::post('login', [AuthController::class, 'login']);
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');

// // Password Reset Routes
// Route::get('password/reset/{token}', [PasswordResetController::class, 'showResetForm'])->name('password.reset');
// Route::post('password/reset', [PasswordResetController::class, 'reset'])->name('password.update');
// Route::post('password/email', [PasswordResetController::class, 'sendResetLinkEmail'])->name('password.email');
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [PasswordResetController::class, 'reset']);
// // Add this route for the reset form if you plan to use a web route to handle the reset password form
// Route::get('/reset-password/{token}', function ($token) {
//     return redirect()->to(env('FRONTEND_URL') . '/reset-password-page/' . $token);
// })->name('password.reset');

// Link to the domain
Route::get('/reset-password/{token}', function ($token) {
    return redirect()->to('https://student-management-system.site/reset-password-page/' . $token);
})->name('password.reset');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('logout', [AuthController::class, 'logout']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    // Route::apiResource('/users', UserController::class);

    // Route::post('register', [AuthController::class, 'register']);
// Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

    // Lesson
    Route::post('/add-lesson', [LessonController::class, 'addNewLesson']);
    Route::post('/set-lesson-time', [LessonController::class, 'setLessonTime']);
    Route::put('/edit-lesson/{id}', [LessonController::class, 'updateLesson']);
    Route::delete('/delete-lesson/{id}', [LessonController::class, 'deleteLesson']);
    Route::get('lessons', [LessonController::class, 'getLessons']);
    Route::get('/timetable-lessons', [LessonController::class, 'getTimetableLessons']);
    Route::get('/teachers-timetable', [LessonController::class, 'getTeachersTimetable']);
    Route::post('/reschedule-lesson', [LessonController::class, 'rescheduleLesson']);

    // Room 
    Route::get('rooms', [RoomController::class, 'index']);
    Route::get('/get-room/{id}', [RoomController::class, 'getRoom']);
    Route::put('/edit-room/{id}', [RoomController::class, 'updateRoom']);
    Route::post('/add-room', [RoomController::class, 'addNewRoom']);
    Route::delete('/rooms/{id}', [RoomController::class, 'deleteRoom']);

    // Dashboard
    Route::get('/student-count', [DashboardController::class, 'getStudentCount']);
    Route::get('/teacher-count', [DashboardController::class, 'getTeacherCount']);
    Route::get('/room-count', [DashboardController::class, 'getRoomCount']);
    Route::get('/subject-count', [DashboardController::class, 'getSubjectCount']);

    // Center Profile
    Route::get('center-profile', [CenterProfileController::class, 'index']);
    Route::post('/update-center-profile', [CenterProfileController::class, 'update']);

    // Subject
    Route::get('subjects', [SubjectController::class, 'index']);
    Route::post('add-subject', [SubjectController::class, 'addSubject']);
    Route::delete('/delete-subject/{id}', [SubjectController::class, 'deleteSubject']);
    Route::put('/edit-subject/{id}', [SubjectController::class, 'updateSubject']);
    // ZY- Route to fetch specific subject details by ID
    Route::get('/subjects/{id}', [SubjectController::class, 'show']);

    //Study Level
    Route::get('study-levels', [StudyLevelController::class, 'index']);
    Route::post('add-study-level', [StudyLevelController::class, 'addStudyLevel']);
    Route::delete('/delete-study-level/{id}', [StudyLevelController::class, 'deleteStudyLevel']);

    // Attendance
    Route::get('students', [AttendanceController::class, 'getStudentsList']);
    Route::post('/mark-attendance', [AttendanceController::class, 'store']);
    Route::get('/lessons/{lessonId}/students', [LessonController::class, 'getEnrolledStudents']);
    Route::get('/attendances/{lessonId}', [AttendanceController::class, 'checkAttendance']);
    Route::get('/teachers/{teacherId}/students', [LessonController::class, 'getStudentsForTeacher']);
    Route::get('/attendances/percentage/{id}', [AttendanceController::class, 'getAttendancePercentage']);

    // Attendance Report
    Route::get('/lessons/{lesson_id}/classes/count', [LessonController::class, 'getTotalClassesHeld']);
    Route::get('/lessons/{lesson_id}/students/count', [LessonController::class, 'getTotalStudents']);
    Route::get('/lessons/{lesson_id}/attendance/average-rate', [LessonController::class, 'getAverageAttendanceRate']);
    Route::get('/lessons/{lesson_id}/absences', [LessonController::class, 'getStudentAbsences']);
    Route::get('/lessons/{lesson_id}/students/attendance-details', [LessonController::class, 'getStudentAttendanceDetails']);
    Route::get('/lessons/{lesson_id}/debugging', [LessonController::class, 'getStudentAttendance']);

    // Student Attendance Report
    Route::get('/lessons/enrollments/{student_id}', [EnrollmentController::class, 'getEnrollmentsByStudent']);
    Route::get('/attendance/{student_id}', [AttendanceController::class, 'getStudentAttendanceByDateRange']);
    Route::get('/attendance/summary/{student_id}', [AttendanceController::class, 'getStudentAttendanceSummary']);

    //Announcement
    Route::get('/announcement/{id?}', [AnnouncementController::class, 'index']);
    Route::get('/announcement/lessons/{id}', [LessonController::class, 'getLessonsByAnnouncement']);
    Route::get('/announcement/parents/{lessonId}', [AnnouncementController::class, 'getParentCount']);
    Route::post('/send-announcement', [AnnouncementController::class, 'sendAnnouncement']);
    Route::post('/save-announcement', [AnnouncementController::class, 'saveAnnouncement']);
    Route::post('/send-whatsapp', [AnnouncementController::class, 'sendMessage']);

    // USER
// Route::apiResource('/users', UserController::class);
// Route to fetch the list of all users
    Route::get('/users', [UserController::class, 'index']);
    // Route to store a new user details
    Route::post('/users', [UserController::class, 'store']);
    // Route to fetch specific user details by ID
    Route::get('/users/{id}', [UserController::class, 'show']);
    // Route to update specific user details by ID
    Route::put('/users/{id}', [UserController::class, 'update']);

    // INVOICE
// Route::apiResource('/invoices', InvoiceController::class);
// Route to fetch the list of all invoices
// Route::get('/invoices', [InvoiceController::class, 'index']);
    Route::get('/invoices', [InvoiceController::class, 'filterInvoices']);
    // Route to store a new invoice details
    Route::post('/invoices', [InvoiceController::class, 'store']);
    // Route to fetch specific invoice details by ID
    Route::get('/invoices/{id}', [InvoiceController::class, 'show']);
    // Route to update specific invoice details by ID
    Route::put('/invoices/{id}', [InvoiceController::class, 'update']);
    // Route to delete specific invoice details by ID
    Route::delete('/invoices/{id}', [InvoiceController::class, 'destroy']);
    // Route to generate invoice number
    Route::get('/generate-invoice-number', [InvoiceController::class, 'generateInvoiceNumber']);
    // Route to send invoice via email
    Route::post('/send-invoice-pdf-email', [InvoiceController::class, 'sendInvoicePdfEmail']);

    // ADMIN
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

    // TEACHER
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
    // Route to fetch teacher by user id >> added by Regina for attendance
    Route::get('/teachers/users/{userId}', [TeacherController::class, 'getTeacherByUserId']);
    // Route to fetch specific teacher details by ID
    Route::get('/teacher-details/users/{userId}', [TeacherController::class, 'getTeacherDetailsByUserId']);


    // STUDENT
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
    // Route to fetch students for specific teacher by user id
    Route::get('/students-with/teacher/users/{userId}', [StudentController::class, 'getStudentsForTeacher']);


    // Additional routes for managing the relationship
    Route::post('students/{id}/parents', [StudentController::class, 'addParents']);
    Route::delete('students/{id}/parents/{parent}', [StudentController::class, 'removeParent']);
    Route::get('students/{id}/parents', [StudentController::class, 'getParents']);

    // PARENTS
// Route::apiResource('/parents', ParentController::class);
// Route to fetch the list of all parents
    Route::get('/parents', [ParentsController::class, 'index']);
    // Route to store a new parent 
    Route::post('/parents', [ParentsController::class, 'store']);
    // Route to fetch specific parent details by ID
    Route::get('/parents/{id}', [ParentsController::class, 'show']);
    // Route to update specific parent details by ID
    Route::put('/parents/{id}', [ParentsController::class, 'update']);

    // ENROLLMENT
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

    // RECORD PAYMENT
// Route to fetch the list of all record paymemts
// Route::get('/record-payments', [RecordPaymentController::class, 'index']);
    Route::get('/record-payments', [RecordPaymentController::class, 'filterPayments']);
    // Route to store a new record payment
    Route::post('/record-payments', [RecordPaymentController::class, 'store']);
    // Route to retrieve specific record payment details by ID
    Route::get('/record-payment-for/invoice/{id}', [RecordPaymentController::class, 'show']);
    // Route to update specific record payment details by ID
    Route::put('/record-payment-for/invoice/{id}', [RecordPaymentController::class, 'update']);
    // Route to delete specific record payment details by ID
    Route::delete('/record-payment-for/invoice/{id}', [RecordPaymentController::class, 'destroy']);
    // Route to generate receipt number
    Route::get('/generate-receipt-number', [RecordPaymentController::class, 'generateReceiptNumber']);
    // Route to send payment receipt via email
    Route::post('/send-receipt-pdf-email', [RecordPaymentController::class, 'sendReceiptPdfEmail']);

    // FEEDBACK
// Fetch all students for admins
    Route::get('/feedback-list/all-students', [FeedbackController::class, 'fetchAllStudents']);
    // Fetch specific teacher's students
    Route::get('/feedback-list/teacher/user/{userId}', [FeedbackController::class, 'fetchTeacherStudents']);
    // Fetch feedback history for a student and related subjects
    Route::get('/students/{studentId}/subjects/{subjectId}/feedback', [FeedbackController::class, 'getFeedbackHistory']);
    // Fetch feedback details by ID
    Route::get('/feedback/{id}', [FeedbackController::class, 'show']);
    // Update feedback details by ID
    Route::put('/feedback/{id}', [FeedbackController::class, 'update']);
    // Route to send student assessment review form via email
    Route::post('/send-review-form-pdf-email', [FeedbackController::class, 'sendReviewFormPdfEmail']);

    // TEACHER DASHBOARD
    Route::get('/teacher-dashboard-counts/{userId}', [TeacherDashboardController::class, 'getStudentCountsForTeacher']);

});


// use App\Http\Controllers\AttendanceController;
// use App\Http\Controllers\AuthController;
// use App\Http\Controllers\CenterProfileController;
// use App\Http\Controllers\LessonController;
// use App\Http\Controllers\UserController;
// use App\Http\Controllers\InvoiceController;
// use App\Http\Controllers\StudentController;
// use App\Http\Controllers\SubjectController;
// use App\Http\Controllers\EnrollmentController;
// use App\Http\Controllers\PasswordResetController;
// use App\Http\Controllers\RoomController;
// use App\Http\Controllers\AdminController;
// use App\Http\Controllers\AnnouncementController;
// use App\Http\Controllers\DashboardController;
// use App\Http\Controllers\TeacherController;
// use App\Http\Controllers\ParentsController;
// use App\Http\Controllers\StudyLevelController;
// use App\Http\Controllers\RecordPaymentController;
// use App\Http\Controllers\FeedbackController;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\TeacherDashboardController;

// /*
// |--------------------------------------------------------------------------
// | API Routes
// |--------------------------------------------------------------------------
// |
// | Here is where you can register API routes for your application. These
// | routes are loaded by the RouteServiceProvider and all of them will
// | be assigned to the "api" middleware group. Make something great!
// |
// */

// Route::middleware('auth:sanctum')->group(function () {
//     Route::get('logout', [AuthController::class, 'logout']);

//     Route::get('/user', function (Request $request) {
//         return $request->user();
//     });
//     // Route::apiResource('/users', UserController::class);
// });

// Route::post('login', [AuthController::class, 'login']);
// // Route::post('register', [AuthController::class, 'register']);
// // Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

// // Lesson
// Route::post('/add-lesson', [LessonController::class, 'addNewLesson']);
// Route::post('/set-lesson-time', [LessonController::class, 'setLessonTime']);
// Route::put('/edit-lesson/{id}', [LessonController::class, 'updateLesson']);
// Route::delete('/delete-lesson/{id}', [LessonController::class, 'deleteLesson']);
// Route::get('lessons', [LessonController::class, 'getLessons']);
// Route::get('/timetable-lessons', [LessonController::class, 'getTimetableLessons']);
// Route::get('/teachers-timetable', [LessonController::class, 'getTeachersTimetable']);
// Route::post('/reschedule-lesson', [LessonController::class, 'rescheduleLesson']);

// // Room 
// Route::get('rooms', [RoomController::class, 'index']);
// Route::get('/get-room/{id}', [RoomController::class, 'getRoom']);
// Route::put('/edit-room/{id}', [RoomController::class, 'updateRoom']);
// Route::post('/add-room', [RoomController::class, 'addNewRoom']);
// Route::delete('/rooms/{id}', [RoomController::class, 'deleteRoom']);

// // Dashboard
// Route::get('/student-count', [DashboardController::class, 'getStudentCount']);
// Route::get('/teacher-count', [DashboardController::class, 'getTeacherCount']);
// Route::get('/room-count', [DashboardController::class, 'getRoomCount']);
// Route::get('/subject-count', [DashboardController::class, 'getSubjectCount']);

// // Center Profile
// Route::get('center-profile', [CenterProfileController::class, 'index']);
// Route::post('/update-center-profile', [CenterProfileController::class, 'update']);

// // Subject
// Route::get('subjects', [SubjectController::class, 'index']);
// Route::post('add-subject', [SubjectController::class, 'addSubject']);
// Route::delete('/delete-subject/{id}', [SubjectController::class, 'deleteSubject']);
// Route::put('/edit-subject/{id}', [SubjectController::class, 'updateSubject']);
// // ZY- Route to fetch specific subject details by ID
// Route::get('/subjects/{id}', [SubjectController::class, 'show']);

// //Study Level
// Route::get('study-levels', [StudyLevelController::class, 'index']);
// Route::post('add-study-level', [StudyLevelController::class, 'addStudyLevel']);
// Route::delete('/delete-study-level/{id}', [StudyLevelController::class, 'deleteStudyLevel']);

// // Attendance
// Route::get('students', [AttendanceController::class, 'getStudentsList']);
// Route::post('/mark-attendance', [AttendanceController::class, 'store']);
// Route::get('/lessons/{lessonId}/students', [LessonController::class, 'getEnrolledStudents']);
// Route::get('/attendances/{lessonId}', [AttendanceController::class, 'checkAttendance']);
// Route::get('/teachers/{teacherId}/students', [LessonController::class, 'getStudentsForTeacher']);
// Route::get('/attendances/percentage/{id}', [AttendanceController::class, 'getAttendancePercentage']);

// // Attendance Report
// Route::get('/lessons/{lesson_id}/classes/count', [LessonController::class, 'getTotalClassesHeld']);
// Route::get('/lessons/{lesson_id}/students/count', [LessonController::class, 'getTotalStudents']);
// Route::get('/lessons/{lesson_id}/attendance/average-rate', [LessonController::class, 'getAverageAttendanceRate']);
// Route::get('/lessons/{lesson_id}/absences', [LessonController::class, 'getStudentAbsences']);
// Route::get('/lessons/{lesson_id}/students/attendance-details', [LessonController::class, 'getStudentAttendanceDetails']);
// Route::get('/lessons/{lesson_id}/debugging', [LessonController::class, 'getStudentAttendance']);

// // Student Attendance Report
// Route::get('/enrollments/{student_id}', [EnrollmentController::class, 'getEnrollmentsByStudent']);
// Route::get('/attendance/{student_id}', [AttendanceController::class, 'getStudentAttendanceByDateRange']);
// Route::get('/attendance/summary/{student_id}', [AttendanceController::class, 'getStudentAttendanceSummary']);

// //Announcement
// Route::get('/announcement/{id?}', [AnnouncementController::class, 'index']);
// Route::get('/announcement/lessons/{id}', [LessonController::class, 'getLessonsByAnnouncement']);
// Route::get('/announcement/parents/{lessonId}', [AnnouncementController::class, 'getParentCount']);
// Route::post('/send-announcement', [AnnouncementController::class, 'sendAnnouncement']);
// Route::post('/save-announcement', [AnnouncementController::class, 'saveAnnouncement']);
// Route::post('/send-whatsapp', [AnnouncementController::class, 'sendMessage']);

// // USER
// // Route::apiResource('/users', UserController::class);
// // Route to fetch the list of all users
// Route::get('/users', [UserController::class, 'index']);
// // Route to store a new user details
// Route::post('/users', [UserController::class, 'store']);
// // Route to fetch specific user details by ID
// Route::get('/users/{id}', [UserController::class, 'show']);
// // Route to update specific user details by ID
// Route::put('/users/{id}', [UserController::class, 'update']);

// // INVOICE
// // Route::apiResource('/invoices', InvoiceController::class);
// // Route to fetch the list of all invoices
// // Route::get('/invoices', [InvoiceController::class, 'index']);
// Route::get('/invoices', [InvoiceController::class, 'filterInvoices']);
// // Route to store a new invoice details
// Route::post('/invoices', [InvoiceController::class, 'store']);
// // Route to fetch specific invoice details by ID
// Route::get('/invoices/{id}', [InvoiceController::class, 'show']);
// // Route to update specific invoice details by ID
// Route::put('/invoices/{id}', [InvoiceController::class, 'update']);
// // Route to delete specific invoice details by ID
// Route::delete('/invoices/{id}', [InvoiceController::class, 'destroy']);
// // Route to generate invoice number
// Route::get('/generate-invoice-number', [InvoiceController::class, 'generateInvoiceNumber']);
// // Route to send invoice via email
// Route::post('/send-invoice-pdf-email', [InvoiceController::class, 'sendInvoicePdfEmail']);


// // // Password Reset Routes
// // Route::get('password/reset/{token}', [PasswordResetController::class, 'showResetForm'])->name('password.reset');
// // Route::post('password/reset', [PasswordResetController::class, 'reset'])->name('password.update');
// // Route::post('password/email', [PasswordResetController::class, 'sendResetLinkEmail'])->name('password.email');
// Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail']);
// Route::post('/reset-password', [PasswordResetController::class, 'reset']);

// // // Add this route for the reset form if you plan to use a web route to handle the reset password form
// // Route::get('/reset-password/{token}', function ($token) {
// //     return redirect()->to(env('FRONTEND_URL') . '/reset-password-page/' . $token);
// // })->name('password.reset');

// // Link to the domain
// Route::get('/reset-password/{token}', function ($token) {
//     return redirect()->to('https://student-management-system.site/reset-password-page/' . $token);
// })->name('password.reset');

// // ADMIN
// // Route::apiResource('/admins', AdminController::class);
// // Route to fetch the list of all admins
// Route::get('/admins', [AdminController::class, 'index']);
// // Route to store a new admin and associated user details
// Route::post('/admins', [AdminController::class, 'store']);
// // Route to fetch specific admin details by ID
// Route::get('/admins/{id}', [AdminController::class, 'show']);
// // Route to update specific admin details by ID
// Route::put('/admins/{id}', [AdminController::class, 'update']);
// // Route to delete specific admin details and the associated user account by ID
// Route::delete('/admins/{id}', [AdminController::class, 'destroy']);

// // TEACHER
// // Route to fetch the list of all teachers
// Route::get('/teachers', [TeacherController::class, 'index']);
// // Route to store a new teacher and associated user details
// Route::post('/teachers', [TeacherController::class, 'store']);
// // Route to fetch specific teacher details by ID
// Route::get('/teachers/{id}', [TeacherController::class, 'show']);
// // Route to update specific teacher details by ID
// Route::put('/teachers/{id}', [TeacherController::class, 'update']);
// // Route to delete specific teacher details and the associated user account by ID
// Route::delete('/teachers/{id}', [TeacherController::class, 'destroy']);
// // Route to fetch teacher by user id >> added by Regina for attendance
// Route::get('/teachers/users/{userId}', [TeacherController::class, 'getTeacherByUserId']);
// // Route to fetch specific teacher details by ID
// Route::get('/teacher-details/users/{userId}', [TeacherController::class, 'getTeacherDetailsByUserId']);


// // STUDENT
// // Route::apiResource('/students', StudentController::class);
// // Route to fetch the list of all students
// Route::get('/students', [StudentController::class, 'index']);
// // Route to store a new student 
// Route::post('/students', [StudentController::class, 'store']);
// // Route to fetch specific student details by ID
// Route::get('/students/{id}', [StudentController::class, 'show']);
// // Route to update specific student details by ID
// Route::put('/students/{id}', [StudentController::class, 'update']);
// // Route to delete specific student details by ID
// Route::delete('/students/{id}', [StudentController::class, 'destroy']);
// // Route to fetch students for specific teacher by user id
// Route::get('/students-with/teacher/users/{userId}', [StudentController::class, 'getStudentsForTeacher']);


// // Additional routes for managing the relationship
// Route::post('students/{id}/parents', [StudentController::class, 'addParents']);
// Route::delete('students/{id}/parents/{parent}', [StudentController::class, 'removeParent']);
// Route::get('students/{id}/parents', [StudentController::class, 'getParents']);

// // PARENTS
// // Route::apiResource('/parents', ParentController::class);
// // Route to fetch the list of all parents
// Route::get('/parents', [ParentsController::class, 'index']);
// // Route to store a new parent 
// Route::post('/parents', [ParentsController::class, 'store']);
// // Route to fetch specific parent details by ID
// Route::get('/parents/{id}', [ParentsController::class, 'show']);
// // Route to update specific parent details by ID
// Route::put('/parents/{id}', [ParentsController::class, 'update']);

// // ENROLLMENT
// // Route::apiResource('/enrollments', EnrollmentController::class);
// // Route to fetch the list of all enrollments
// Route::get('/enrollments', [EnrollmentController::class, 'index']);
// // Route to store a new enrollment
// Route::post('/enrollments', [EnrollmentController::class, 'store']);
// // Route to retrieve specific enrollment details by ID
// Route::get('/enrollments/{id}', [EnrollmentController::class, 'show']);
// // Route to update specific enrollment details by ID
// Route::put('/enrollments/{id}', [EnrollmentController::class, 'update']);
// // Route to delete specific enrollment details by ID
// Route::delete('/enrollments/{id}', [EnrollmentController::class, 'destroy']);

// // RECORD PAYMENT
// // Route to fetch the list of all record paymemts
// // Route::get('/record-payments', [RecordPaymentController::class, 'index']);
// Route::get('/record-payments', [RecordPaymentController::class, 'filterPayments']);
// // Route to store a new record payment
// Route::post('/record-payments', [RecordPaymentController::class, 'store']);
// // Route to retrieve specific record payment details by ID
// Route::get('/record-payment-for/invoice/{id}', [RecordPaymentController::class, 'show']);
// // Route to update specific record payment details by ID
// Route::put('/record-payment-for/invoice/{id}', [RecordPaymentController::class, 'update']);
// // Route to delete specific record payment details by ID
// Route::delete('/record-payment-for/invoice/{id}', [RecordPaymentController::class, 'destroy']);
// // Route to generate receipt number
// Route::get('/generate-receipt-number', [RecordPaymentController::class, 'generateReceiptNumber']);
// // Route to send payment receipt via email
// Route::post('/send-receipt-pdf-email', [RecordPaymentController::class, 'sendReceiptPdfEmail']);

// // FEEDBACK
// // Fetch all students for admins
// Route::get('/feedback-list/all-students', [FeedbackController::class, 'fetchAllStudents']);
// // Fetch specific teacher's students
// Route::get('/feedback-list/teacher/user/{userId}', [FeedbackController::class, 'fetchTeacherStudents']);
// // Fetch feedback history for a student and related subjects
// Route::get('/students/{studentId}/subjects/{subjectId}/feedback', [FeedbackController::class, 'getFeedbackHistory']);
// // Fetch feedback details by ID
// Route::get('/feedback/{id}', [FeedbackController::class, 'show']);
// // Update feedback details by ID
// Route::put('/feedback/{id}', [FeedbackController::class, 'update']);
// // Route to send student assessment review form via email
// Route::post('/send-review-form-pdf-email', [FeedbackController::class, 'sendReviewFormPdfEmail']);

// // TEACHER DASHBOARD
// Route::get('/teacher-dashboard-counts/{userId}', [TeacherDashboardController::class, 'getStudentCountsForTeacher']);


// use App\Http\Controllers\AttendanceController;
// use App\Http\Controllers\AuthController;
// use App\Http\Controllers\CenterProfileController;
// use App\Http\Controllers\LessonController;
// use App\Http\Controllers\UserController;
// use App\Http\Controllers\InvoiceController;
// use App\Http\Controllers\StudentController;
// use App\Http\Controllers\SubjectController;
// use App\Http\Controllers\EnrollmentController;
// use App\Http\Controllers\PasswordResetController;
// use App\Http\Controllers\RoomController;
// use App\Http\Controllers\AdminController;
// use App\Http\Controllers\AnnouncementController;
// use App\Http\Controllers\DashboardController;
// use App\Http\Controllers\TeacherController;
// use App\Http\Controllers\ParentsController;
// use App\Http\Controllers\StudyLevelController;
// use App\Http\Controllers\RecordPaymentController;
// use App\Http\Controllers\FeedbackController;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\TeacherDashboardController;

// /*
// |--------------------------------------------------------------------------
// | API Routes
// |--------------------------------------------------------------------------
// |
// | Here is where you can register API routes for your application. These
// | routes are loaded by the RouteServiceProvider and all of them will
// | be assigned to the "api" middleware group. Make something great!
// |
// */
// Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
// Route::post('login', [AuthController::class, 'login']);

// Route::middleware('auth:sanctum')->group(function () {
//     Route::get('logout', [AuthController::class, 'logout']);

//     Route::get('/user', function (Request $request) {
//         return $request->user();
//     });

//     // Lesson
//     Route::post('/add-lesson', [LessonController::class, 'addNewLesson']);
//     Route::post('/set-lesson-time', [LessonController::class, 'setLessonTime']);
//     Route::put('/edit-lesson/{id}', [LessonController::class, 'updateLesson']);
//     Route::delete('/delete-lesson/{id}', [LessonController::class, 'deleteLesson']);
//     Route::get('lessons', [LessonController::class, 'getLessons']);
//     Route::get('/timetable-lessons', [LessonController::class, 'getTimetableLessons']);
//     Route::get('/teachers-timetable', [LessonController::class, 'getTeachersTimetable']);
//     Route::post('/reschedule-lesson', [LessonController::class, 'rescheduleLesson']);

//     // Room 
//     Route::get('rooms', [RoomController::class, 'index']);
//     Route::get('/get-room/{id}', [RoomController::class, 'getRoom']);
//     Route::put('/edit-room/{id}', [RoomController::class, 'updateRoom']);
//     Route::post('/add-room', [RoomController::class, 'addNewRoom']);
//     Route::delete('/rooms/{id}', [RoomController::class, 'deleteRoom']);

//     // Dashboard
//     Route::get('/student-count', [DashboardController::class, 'getStudentCount']);
//     Route::get('/teacher-count', [DashboardController::class, 'getTeacherCount']);
//     Route::get('/room-count', [DashboardController::class, 'getRoomCount']);
//     Route::get('/subject-count', [DashboardController::class, 'getSubjectCount']);

//     // Center Profile
//     Route::get('center-profile', [CenterProfileController::class, 'index']);
//     Route::post('/update-center-profile', [CenterProfileController::class, 'update']);

//     // Subject
//     Route::get('subjects', [SubjectController::class, 'index']);
//     Route::post('add-subject', [SubjectController::class, 'addSubject']);
//     Route::delete('/delete-subject/{id}', [SubjectController::class, 'deleteSubject']);
//     Route::put('/edit-subject/{id}', [SubjectController::class, 'updateSubject']);
//     // ZY- Route to fetch specific subject details by ID
//     Route::get('/subjects/{id}', [SubjectController::class, 'show']);

//     //Study Level
//     Route::get('study-levels', [StudyLevelController::class, 'index']);
//     Route::post('add-study-level', [StudyLevelController::class, 'addStudyLevel']);
//     Route::delete('/delete-study-level/{id}', [StudyLevelController::class, 'deleteStudyLevel']);

//     // Attendance
//     Route::get('students', [AttendanceController::class, 'getStudentsList']);
//     Route::post('/mark-attendance', [AttendanceController::class, 'store']);
//     Route::get('/lessons/{lessonId}/students', [LessonController::class, 'getEnrolledStudents']);
//     Route::get('/attendances/{lessonId}', [AttendanceController::class, 'checkAttendance']);
//     Route::get('/teachers/{teacherId}/students', [LessonController::class, 'getStudentsForTeacher']);
//     Route::get('/attendances/percentage/{id}', [AttendanceController::class, 'getAttendancePercentage']);

//     // Attendance Report
//     Route::get('/lessons/{lesson_id}/classes/count', [LessonController::class, 'getTotalClassesHeld']);
//     Route::get('/lessons/{lesson_id}/students/count', [LessonController::class, 'getTotalStudents']);
//     Route::get('/lessons/{lesson_id}/attendance/average-rate', [LessonController::class, 'getAverageAttendanceRate']);
//     Route::get('/lessons/{lesson_id}/absences', [LessonController::class, 'getStudentAbsences']);
//     Route::get('/lessons/{lesson_id}/students/attendance-details', [LessonController::class, 'getStudentAttendanceDetails']);
//     Route::get('/lessons/{lesson_id}/debugging', [LessonController::class, 'getStudentAttendance']);

//     // Student Attendance Report
//     Route::get('/enrollments/{student_id}', [EnrollmentController::class, 'getEnrollmentsByStudent']);
//     Route::get('/attendance/{student_id}', [AttendanceController::class, 'getStudentAttendanceByDateRange']);
//     Route::get('/attendance/summary/{student_id}', [AttendanceController::class, 'getStudentAttendanceSummary']);

//     //Announcement
//     Route::get('/announcement/{id?}', [AnnouncementController::class, 'index']);
//     Route::get('/announcement/lessons/{id}', [LessonController::class, 'getLessonsByAnnouncement']);
//     Route::get('/announcement/parents/{lessonId}', [AnnouncementController::class, 'getParentCount']);
//     Route::post('/send-announcement', [AnnouncementController::class, 'sendAnnouncement']);
//     Route::post('/save-announcement', [AnnouncementController::class, 'saveAnnouncement']);
//     Route::post('/send-whatsapp', [AnnouncementController::class, 'sendMessage']);

//     // USER
//     // Route::apiResource('/users', UserController::class);
//     // Route to fetch the list of all users
//     Route::get('/users', [UserController::class, 'index']);
//     // Route to store a new user details
//     Route::post('/users', [UserController::class, 'store']);
//     // Route to fetch specific user details by ID
//     Route::get('/users/{id}', [UserController::class, 'show']);
//     // Route to update specific user details by ID
//     Route::put('/users/{id}', [UserController::class, 'update']);

//     // INVOICE
//     // Route::apiResource('/invoices', InvoiceController::class);
//     // Route to fetch the list of all invoices
//     // Route::get('/invoices', [InvoiceController::class, 'index']);
//     Route::get('/invoices', [InvoiceController::class, 'filterInvoices']);
//     // Route to store a new invoice details
//     Route::post('/invoices', [InvoiceController::class, 'store']);
//     // Route to fetch specific invoice details by ID
//     Route::get('/invoices/{id}', [InvoiceController::class, 'show']);
//     // Route to update specific invoice details by ID
//     Route::put('/invoices/{id}', [InvoiceController::class, 'update']);
//     // Route to delete specific invoice details by ID
//     Route::delete('/invoices/{id}', [InvoiceController::class, 'destroy']);
//     // Route to generate invoice number
//     Route::get('/generate-invoice-number', [InvoiceController::class, 'generateInvoiceNumber']);
//     // Route to send invoice via email
//     Route::post('/send-invoice-pdf-email', [InvoiceController::class, 'sendInvoicePdfEmail']);


//     // // Password Reset Routes
//     // Route::get('password/reset/{token}', [PasswordResetController::class, 'showResetForm'])->name('password.reset');
//     // Route::post('password/reset', [PasswordResetController::class, 'reset'])->name('password.update');
//     // Route::post('password/email', [PasswordResetController::class, 'sendResetLinkEmail'])->name('password.email');
//     Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail']);
//     Route::post('/reset-password', [PasswordResetController::class, 'reset']);

//     // // Add this route for the reset form if you plan to use a web route to handle the reset password form
//     Route::get('/reset-password/{token}', function ($token) {
//         return redirect()->to('http://localhost:3000/reset-password/' . $token);
//     })->name('password.reset');

//     // ADMIN
//     // Route::apiResource('/admins', AdminController::class);
//     // Route to fetch the list of all admins
//     Route::get('/admins', [AdminController::class, 'index']);
//     // Route to store a new admin and associated user details
//     Route::post('/admins', [AdminController::class, 'store']);
//     // Route to fetch specific admin details by ID
//     Route::get('/admins/{id}', [AdminController::class, 'show']);
//     // Route to update specific admin details by ID
//     Route::put('/admins/{id}', [AdminController::class, 'update']);
//     // Route to delete specific admin details and the associated user account by ID
//     Route::delete('/admins/{id}', [AdminController::class, 'destroy']);

//     // TEACHER
//     // Route to fetch the list of all teachers
//     Route::get('/teachers', [TeacherController::class, 'index']);
//     // Route to store a new teacher and associated user details
//     Route::post('/teachers', [TeacherController::class, 'store']);
//     // Route to fetch specific teacher details by ID
//     Route::get('/teachers/{id}', [TeacherController::class, 'show']);
//     // Route to update specific teacher details by ID
//     Route::put('/teachers/{id}', [TeacherController::class, 'update']);
//     // Route to delete specific teacher details and the associated user account by ID
//     Route::delete('/teachers/{id}', [TeacherController::class, 'destroy']);
//     // Route to fetch teacher by user id >> added by Regina for attendance
//     Route::get('/teachers/users/{userId}', [TeacherController::class, 'getTeacherByUserId']);
//     // Route to fetch specific teacher details by ID
//     Route::get('/teacher-details/users/{userId}', [TeacherController::class, 'getTeacherDetailsByUserId']);


//     // STUDENT
//     // Route::apiResource('/students', StudentController::class);
//     // Route to fetch the list of all students
//     Route::get('/students', [StudentController::class, 'index']);
//     // Route to store a new student 
//     Route::post('/students', [StudentController::class, 'store']);
//     // Route to fetch specific student details by ID
//     Route::get('/students/{id}', [StudentController::class, 'show']);
//     // Route to update specific student details by ID
//     Route::put('/students/{id}', [StudentController::class, 'update']);
//     // Route to delete specific student details by ID
//     Route::delete('/students/{id}', [StudentController::class, 'destroy']);
//     // Route to fetch students for specific teacher by user id
//     Route::get('/students-with/teacher/users/{userId}', [StudentController::class, 'getStudentsForTeacher']);


//     // Additional routes for managing the relationship
//     Route::post('students/{id}/parents', [StudentController::class, 'addParents']);
//     Route::delete('students/{id}/parents/{parent}', [StudentController::class, 'removeParent']);
//     Route::get('students/{id}/parents', [StudentController::class, 'getParents']);

//     // PARENTS
//     // Route::apiResource('/parents', ParentController::class);
//     // Route to fetch the list of all parents
//     Route::get('/parents', [ParentsController::class, 'index']);
//     // Route to store a new parent 
//     Route::post('/parents', [ParentsController::class, 'store']);
//     // Route to fetch specific parent details by ID
//     Route::get('/parents/{id}', [ParentsController::class, 'show']);
//     // Route to update specific parent details by ID
//     Route::put('/parents/{id}', [ParentsController::class, 'update']);

//     // ENROLLMENT
//     // Route::apiResource('/enrollments', EnrollmentController::class);
//     // Route to fetch the list of all enrollments
//     Route::get('/enrollments', [EnrollmentController::class, 'index']);
//     // Route to store a new enrollment
//     Route::post('/enrollments', [EnrollmentController::class, 'store']);
//     // Route to retrieve specific enrollment details by ID
//     Route::get('/enrollments/{id}', [EnrollmentController::class, 'show']);
//     // Route to update specific enrollment details by ID
//     Route::put('/enrollments/{id}', [EnrollmentController::class, 'update']);
//     // Route to delete specific enrollment details by ID
//     Route::delete('/enrollments/{id}', [EnrollmentController::class, 'destroy']);

//     // RECORD PAYMENT
//     // Route to fetch the list of all record paymemts
//     // Route::get('/record-payments', [RecordPaymentController::class, 'index']);
//     Route::get('/record-payments', [RecordPaymentController::class, 'filterPayments']);
//     // Route to store a new record payment
//     Route::post('/record-payments', [RecordPaymentController::class, 'store']);
//     // Route to retrieve specific record payment details by ID
//     Route::get('/record-payment-for/invoice/{id}', [RecordPaymentController::class, 'show']);
//     // Route to update specific record payment details by ID
//     Route::put('/record-payment-for/invoice/{id}', [RecordPaymentController::class, 'update']);
//     // Route to delete specific record payment details by ID
//     Route::delete('/record-payment-for/invoice/{id}', [RecordPaymentController::class, 'destroy']);
//     // Route to generate receipt number
//     Route::get('/generate-receipt-number', [RecordPaymentController::class, 'generateReceiptNumber']);
//     // Route to send payment receipt via email
//     Route::post('/send-receipt-pdf-email', [RecordPaymentController::class, 'sendReceiptPdfEmail']);

//     // FEEDBACK
//     // Fetch all students for admins
//     Route::get('/feedback-list/all-students', [FeedbackController::class, 'fetchAllStudents']);
//     // Fetch specific teacher's students
//     Route::get('/feedback-list/teacher/user/{userId}', [FeedbackController::class, 'fetchTeacherStudents']);
//     // Fetch feedback history for a student and related subjects
//     Route::get('/students/{studentId}/subjects/{subjectId}/feedback', [FeedbackController::class, 'getFeedbackHistory']);
//     // Fetch feedback details by ID
//     Route::get('/feedback/{id}', [FeedbackController::class, 'show']);
//     // Update feedback details by ID
//     Route::put('/feedback/{id}', [FeedbackController::class, 'update']);
//     // Route to send student assessment review form via email
//     Route::post('/send-review-form-pdf-email', [FeedbackController::class, 'sendReviewFormPdfEmail']);

//     // TEACHER DASHBOARD
//     Route::get('/teacher-dashboard-counts/{userId}', [TeacherDashboardController::class, 'getStudentCountsForTeacher']);
// });



// based on user role to access the api routes, will be implemented later

// use Illuminate\Http\Request;
// use App\Http\Controllers\AuthController;
// use App\Http\Controllers\AdminController;
// use App\Http\Controllers\TeacherController;
// use App\Http\Controllers\LessonController;
// use App\Http\Controllers\RoomController;
// use App\Http\Controllers\SubjectController;
// use App\Http\Controllers\InvoiceController;
// use App\Http\Controllers\EnrollmentController;
// use App\Http\Controllers\AttendanceController;
// use App\Http\Controllers\CenterProfileController;
// use App\Http\Controllers\PasswordResetController;
// use App\Http\Controllers\StudentController;

// // Auth routes (accessible by both admin and teacher)
// Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
// Route::post('login', [AuthController::class, 'login']);
// Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail']);
// Route::post('/reset-password', [PasswordResetController::class, 'reset']);

// // Route::get('/students', [StudentController::class, 'index']);

// // Routes that require authentication via Sanctum
// Route::middleware('auth:sanctum')->group(function () {
//     // Route::get('/students', [StudentController::class, 'index']);
//     Route::get('lessons', [LessonController::class, 'getLessons']);
//     // Admin Routes (accessible only by admins)
//     Route::group(['middleware' => 'role:admin'], function () {

//         // Admin-specific routes
//         // Route to fetch the list of all admins
//         Route::get('/admins', [AdminController::class, 'index']);
//         // Route to store a new admin and associated user details
//         Route::post('/admins', [AdminController::class, 'store']);
//         // Route to fetch specific admin details by ID
//         Route::get('/admins/{id}', [AdminController::class, 'show']);
//         // Route to update specific admin details by ID
//         Route::put('/admins/{id}', [AdminController::class, 'update']);
//         // Route to delete specific admin details and the associated user account by ID
//         Route::delete('/admins/{id}', [AdminController::class, 'destroy']);

//         // Route to fetch the list of all teachers
//         Route::get('/teachers', [TeacherController::class, 'index']);
//         // Route to store a new teacher and associated user details
//         Route::post('/teachers', [TeacherController::class, 'store']);
//         // Route to delete specific teacher details and the associated user account by ID
//         Route::delete('/teachers/{id}', [TeacherController::class, 'destroy']);

//         // Route to fetch the list of all students
//         Route::get('/students', [StudentController::class, 'index']);
//         // Route to store a new student 
//         Route::post('/students', [StudentController::class, 'store']);
//         // Route to update specific student details by ID
//         Route::put('/students/{id}', [StudentController::class, 'update']);
//         // Route to delete specific student details by ID
//         Route::delete('/students/{id}', [StudentController::class, 'destroy']);


//         Route::apiResource('/rooms', RoomController::class);
//         Route::apiResource('/subjects', SubjectController::class);
//         Route::apiResource('/invoices', InvoiceController::class);
//         Route::apiResource('/enrollments', EnrollmentController::class);
//         Route::get('/center-profile', [CenterProfileController::class, 'index']);
//         Route::post('/update-center-profile', [CenterProfileController::class, 'update']);

//     });

//     // Teacher Routes (accessible only by teachers)
//     Route::group(['middleware' => 'role:teacher'], function () {
//         // Teacher-specific routes

//         Route::get('/timetable-lessons', [LessonController::class, 'getTimetableLessons']);
//         Route::get('students', [AttendanceController::class, 'getStudentsList']);
//         Route::post('/mark-attendance', [AttendanceController::class, 'markAttendance']);

//     });

//     Route::get('/timetable-lessons', [LessonController::class, 'getTimetableLessons']);

//     // Shared Routes (accessible by both admin and teacher)
//     Route::get('/students', [StudentController::class, 'index']);
//     Route::get('/students/{id}', [StudentController::class, 'show']);

//     // Route to fetch specific teacher details by ID
//     Route::get('/teachers/{id}', [TeacherController::class, 'show']);
//     // Route to update specific teacher details by ID
//     Route::put('/teachers/{id}', [TeacherController::class, 'update']);

//     // Route to fetch specific student details by ID
//     Route::get('/students/{id}', [StudentController::class, 'show']);


//     Route::get('logout', [AuthController::class, 'logout']);
//     Route::get('/user', function (Request $request) {
//         return $request->user();
//     });
// });
