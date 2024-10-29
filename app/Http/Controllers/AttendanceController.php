<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;
use App\Models\Student;
use Illuminate\Support\Facades\DB;


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

    // public function markAttendance(Request $request)
    // {
    //     $attendance = new Attendance();
    //     $attendance->student_id = $request->input('student_id');
    //     $attendance->lesson_id = $request->input('lesson_id');
    //     $attendance->attendance_status = $request->input('attendance_status');
    //     $attendance->attendance_date = $request->input('attendance_date');
    //     $attendance->save();

    //     return response()->json([
    //         'status' => 200,
    //         'message' => 'Attendance marked successfully!'
    //     ]);

    // }

    public function store(Request $request)
    {
        $request->validate([
            'records' => 'required|array',
            'records.*.lesson_id' => 'required|exists:lessons,id',
            'records.*.student_id' => 'required|exists:students,id',
            'records.*.attendance_status' => 'required|in:present,absent',
            'records.*.date' => 'required|date',
        ]);

        $attendanceRecords = $request->input('records');

        foreach ($attendanceRecords as $record) {
            Attendance::updateOrCreate(
                [
                    'lesson_id' => $record['lesson_id'],
                    'student_id' => $record['student_id'],
                    'attendance_date' => $record['date'],
                ],
                [
                    'attendance_status' => $record['attendance_status'],
                ]
            );
        }

        return response()->json(['message' => 'Attendance records saved successfully'], 200);
    }

    public function checkAttendance($lessonId, Request $request)
    {
        $date = $request->query('date');

        // Check for existing attendance record
        $attendance = Attendance::where('lesson_id', $lessonId)
            ->where('attendance_date', $date)
            ->first();

        return response()->json([
            'attendanceMarked' => $attendance ? true : false,
        ]);
    }

    public function getAttendancePercentage($studentId)
    {
        $attendanceRecords = Attendance::where('student_id', $studentId)
            //DB::raw function is used to construct a raw SQL query that counts the present records and total records.
            ->select(DB::raw('SUM(attendance_status = "present") as present_count, COUNT(*) as total_count'))
            ->first();

        if ($attendanceRecords->total_count > 0) {
            $attendancePercentage = ($attendanceRecords->present_count / $attendanceRecords->total_count) * 100;
        } else {
            $attendancePercentage = 0; // No attendance records found
        }

        return response()->json(['attendance_percentage' => $attendancePercentage]);
    }



}
