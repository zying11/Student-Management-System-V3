<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Models\Student;
use App\Models\Feedback;
use App\Models\Lesson;
use App\Models\Attendance;
use Illuminate\Support\Facades\DB;

class TeacherDashboardController extends Controller
{
    public function getStudentCountsForTeacher($userId)
    {
        // Find the teacher's ID based on the user ID
        $teacher = Teacher::where('user_id', $userId)->first();

        if (!$teacher) {
            return response()->json([
                'message' => 'Teacher not found for the given user ID.',
            ], 404);
        }

        // Fetch students related to the teacher
        $studentsQuery = Student::whereHas('enrollments.lesson', function ($query) use ($teacher) {
            $query->where('teacher_id', $teacher->id);
        });

        // Get student counts (Total, Male, Female)
        $totalStudents = $studentsQuery->count();
        $maleCount = clone $studentsQuery;
        $maleCount = $maleCount->whereRaw('LOWER(gender) = ?', ['male'])->count();
        $femaleCount = clone $studentsQuery;
        $femaleCount = $femaleCount->whereRaw('LOWER(gender) = ?', ['female'])->count();

        // Count subjects taught by the teacher by counting lessons
        $subjectTeachCount = Lesson::where('teacher_id', $teacher->id)->distinct('subject_id')->count('subject_id');

        // Get overall feedback count (including all statuses)
        $overallFeedbackCount = Feedback::where('teacher_id', $teacher->id)->count();

        // Get completed feedback count (status = 2)
        $completedFeedbackCount = Feedback::where('teacher_id', $teacher->id)
            ->where('status', 2)  
            ->count();

        // Calculate total attendance rate for the teacher
        $attendanceRate = $this->calculateTeacherAttendanceRate($teacher);


        return response()->json([
            'total' => $totalStudents,
            'male' => $maleCount,
            'female' => $femaleCount,
            'subjectTeachCount' => $subjectTeachCount,
            'overallFeedbackCount' => $overallFeedbackCount,
            'completedFeedbackCount' => $completedFeedbackCount,
            'attendanceRate' => $attendanceRate['attendanceRate'],
            'absentRate' => $attendanceRate['absentRate'],
        ]);
    }

    // Function to calculate the total attendance rate and absent rate for a teacher
    private function calculateTeacherAttendanceRate($teacher)
    {
        // Fetch all students associated with lessons taught by the teacher
        $students = Student::whereHas('enrollments.lesson', function ($query) use ($teacher) {
            $query->where('teacher_id', $teacher->id);
        })->get();

        $totalAttendanceRate = 0;
        $totalAbsentRate = 0;
        $studentCount = 0;

        foreach ($students as $student) {
            // Calculate individual student's attendance rate
            $attendanceRecords = Attendance::where('student_id', $student->id)
                ->select(DB::raw('SUM(attendance_status = "present") as present_count, COUNT(*) as total_count'))
                ->first();

            if ($attendanceRecords && $attendanceRecords->total_count > 0) {
                $attendanceRate = ($attendanceRecords->present_count / $attendanceRecords->total_count) * 100;
                $absentRate = 100 - $attendanceRate; 
                $totalAttendanceRate += $attendanceRate;
                $totalAbsentRate += $absentRate;
                $studentCount++;
            }
        }

        // Calculate average attendance rate and absent rate for all students
        if ($studentCount > 0) {
            return [
                'attendanceRate' => round($totalAttendanceRate / $studentCount, 2),
                'absentRate' => round($totalAbsentRate / $studentCount, 2),
            ];
        } else {
            return [
                'attendanceRate' => 0, // No students enrolled
                'absentRate' => 0,     // No students enrolled
            ];
        }
    }
}
