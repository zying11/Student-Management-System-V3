<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Enrollment;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;


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

        return response()->json(['status' => 200, 'message' => 'Attendance records saved successfully']);
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

    public function getStudentAttendanceByDateRange(Request $request, $student_id)
    {
        // Validate and retrieve the start and end dates from the request
        $request->validate([
            'startDate' => 'required|date',
            'endDate' => 'required|date|after_or_equal:startDate',
        ]);

        $startDate = Carbon::parse($request->input('startDate'));
        $endDate = Carbon::parse($request->input('endDate'));

        // Fetch attendance records for the specified student and date range
        $attendanceRecords = Attendance::where('student_id', $student_id)
            ->whereBetween('attendance_date', [$startDate, $endDate])
            ->get();

        // If no attendance records are found, return an empty response with a message
        if ($attendanceRecords->isEmpty()) {
            return response()->json([
                'message' => 'No attendance records found for this date range.',
                'data' => []
            ], 200);
        }

        // Calculate total present, total absent, and attendance rate
        $totalPresent = $attendanceRecords->where('attendance_status', 'present')->count();
        $totalAbsent = $attendanceRecords->where('attendance_status', 'absent')->count();
        $attendanceRate = ($totalPresent + $totalAbsent) > 0
            ? round(($totalPresent / ($totalPresent + $totalAbsent)) * 100, 2)
            : 0;

        // Return the data in a structured format
        return response()->json([
            'totalPresent' => $totalPresent,
            'totalAbsent' => $totalAbsent,
            'attendanceRate' => $attendanceRate,
            'attendanceRecords' => $attendanceRecords,
            'dateRange' => [
                'start' => $startDate->toDateString(),
                'end' => $endDate->toDateString()
            ]
        ], 200);
    }



    public function getStudentAttendanceSummary($student_id, Request $request)
    {
        // Filter by date range if provided
        $startDate = $request->query('startDate');
        $endDate = $request->query('endDate');

        // Get attendance data grouped by lesson_id within the specified date range
        $attendanceData = Attendance::with('lesson.subject')
            ->where('student_id', $student_id)
            ->when($startDate && $endDate, function ($query) use ($startDate, $endDate) {
                $query->whereBetween('attendance_date', [$startDate, $endDate]);
            })
            ->selectRaw('
            lesson_id,
            SUM(CASE WHEN attendance_status = "present" THEN 1 ELSE 0 END) as totalPresent,
            SUM(CASE WHEN attendance_status = "absent" THEN 1 ELSE 0 END) as totalAbsent,
            COUNT(*) as totalClasses
        ')
            ->groupBy('lesson_id')
            ->get();

        $result = $attendanceData->map(function ($attendance) {
            $attendanceRate = $attendance->totalClasses > 0 ? ($attendance->totalPresent / $attendance->totalClasses) * 100 : 0;

            return [
                'lesson_id' => $attendance->lesson_id,
                'subject_name' => $attendance->lesson->subject->subject_name ?? 'Unknown',
                'totalPresent' => $attendance->totalPresent,
                'totalAbsent' => $attendance->totalAbsent,
                'totalClasses' => $attendance->totalClasses,
                'attendanceRate' => $attendanceRate,
            ];
        });

        return response()->json($result);
    }

}
