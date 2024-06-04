<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;
use App\Models\Student;

class AttendanceController extends Controller
{
    public function getStudentsList()
    {
        $students = Student::all();
        return response()->json([
            'status' => 200,
            'students' => $students
        ]);
    }

    public function markAttendance(Request $request)
    {
        $attendance = new Attendance();
        $attendance->student_id = $request->input('student_id');
        $attendance->lesson_id = $request->input('lesson_id');
        $attendance->attendance_status = $request->input('attendance_status');
        $attendance->attendance_date = $request->input('attendance_date');
        $attendance->save();

        return response()->json([
            'status' => 200,
            'message' => 'Attendance marked successfully!'
        ]);

    }


}
