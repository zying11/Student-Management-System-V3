<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lesson;
use App\Models\Student;
use App\Models\Attendance;
use Illuminate\Support\Facades\DB;

class LessonController extends Controller
{
    public function index()
    {
        $lessons = Lesson::all();
        return response()->json([
            'status' => 200,
            'lessons' => $lessons
        ]);
    }

    public function addNewLesson(Request $request)
    {
        // Create a new Lesson instance and save to the database
        $lesson = new Lesson();
        $lesson->subject_id = $request->input('subjectId');
        $lesson->teacher_id = $request->input('teacherId');
        $lesson->duration = $request->input('duration');
        $lesson->save();

        return response()->json([
            'status' => 200,
            'message' => 'Lesson added successfully'
        ]);
    }

    // Method 1 to fetch data with foreign keys
    public function getLessons()
    {
        // Setting up the variable to hold the collection of Lesson objects
        $lessons = Lesson::with('subject')
            // Retrieve data from the subjects table related to each lesson
            ->join('subjects', 'lessons.subject_id', '=', 'subjects.id')
            // Retrieve data from the study_level table related to each subject
            ->join('study_level', 'subjects.level_id', '=', 'study_level.id')
            // Retrieve data from the teacher table related to each lesson
            ->join('teachers', 'lessons.teacher_id', '=', 'teachers.id')
            // Retrieve data from the user table related to each teacher
            ->join('users', 'teachers.user_id', '=', 'users.id')
            // Specifies which columns should be retrieved 
            ->select('lessons.*', 'subjects.subject_name', 'study_level.level_name', 'users.name')
            ->get();

        return response()->json([
            'status' => 200,
            'lessons' => $lessons
        ]);
    }

    // Method 2 to fetch data with foreign keys
    public function getTimetableLessons(Request $request)
    {
        // Extracts the value of the room_id query parameter from the URL
        // `http://example.com/api/lessons?room_id=3`
        $roomId = $request->query('room_id');

        // If room_id is provided, filter lessons by room_id
        if ($roomId) {
            $lessons = Lesson::where('room_id', $roomId)
                // each Subject has a related StudyLevel
                ->with(['subject.studyLevel', 'room', 'teacher.user'])
                ->get();
        } else {
            // Otherwise, return all lessons with their related data
            $lessons = Lesson::with(['subject.studyLevel', 'room', 'teacher.user'])->get();
        }

        return response()->json(['lessons' => $lessons]);
    }

    public function getTeachersTimetable(Request $request)
    {
        // Extracts the value of the teacher_id query parameter from the URL
        $teacherId = $request->query('teacher_id');

        // If teacher_id is provided, filter lessons by teacher_id
        if ($teacherId) {
            $lessons = Lesson::where('teacher_id', $teacherId)
                ->with(['subject.studyLevel', 'room', 'teacher.user'])
                ->get();
        } else {
            // Otherwise, return all lessons with their related data
            $lessons = Lesson::with(['subject.studyLevel', 'room', 'teacher.user'])->get();
        }

        return response()->json(['lessons' => $lessons]);
    }


    public function setLessonTime(Request $request)
    {
        // Find the lesson by its ID 
        $lesson = Lesson::find($request->input('id'));

        if (!$lesson) {
            return response()->json([
                'status' => 404,
                'message' => 'Lesson not found',
            ], 404);
        }

        // Update lesson attributes with request data
        $lesson->room_id = $request->input('roomId');
        $lesson->day = $request->input('day');
        $lesson->start_time = $request->input('startTime');
        $lesson->end_time = $request->input('endTime');

        // Update teacher
        // $lesson->teacher_id = $request->input('teacher');
        $lesson->subject->save();

        $lesson->save();

        return response()->json([
            'status' => 200,
            'message' => 'Date and time updated for lesson successfully',
            'lesson' => $lesson,
        ]);
    }

    public function updateLesson(Request $request, $id)
    {
        // Find the lesson by its ID 
        $lesson = Lesson::find($id);

        if (!$lesson) {
            return response()->json([
                'status' => 404,
                'message' => 'Lesson not found',
            ], 404);
        }

        // Update lesson attributes with request data
        $lesson->teacher_id = $request->input('teacher');
        $lesson->save();

        return response()->json([
            'status' => 200,
            'message' => 'Lesson updated successfully',
            'lesson' => $lesson,
        ]);
    }

    public function rescheduleLesson(Request $request)
    {
        // Validate the request
        $request->validate([
            'lesson_id' => 'required|exists:lessons,id',
        ]);

        // Find the lesson by ID
        $lesson = Lesson::find($request->lesson_id);

        // Reset the scheduling fields
        $lesson->day = null;
        $lesson->start_time = null;
        $lesson->end_time = null;
        $lesson->room_id = null;

        // Save the changes
        $lesson->save();

        return response()->json([
            'status' => 200,
            'message' => 'Lesson rescheduled successfully',
            'lesson' => $lesson,
        ]);
    }


    public function deleteLesson($id)
    {
        $lesson = Lesson::find($id);

        if ($lesson) {
            $lesson->delete();
            return response()->json(['status' => 200, 'message' => 'Lesson deleted successfully.']);
        }

        return response()->json(['status' => 404, 'message' => 'Lesson not found.'], 404);
    }

    // Attendance
    public function getEnrolledStudents($lessonId)
    {
        $lesson = Lesson::with('students')->find($lessonId);

        if (!$lesson) {
            // If the lesson does not exist, return a 404 error
            return response()->json(['message' => 'Lesson not found'], 404);
        }

        // If the lesson exists but has no students, return an empty array
        return response()->json([
            'students' => $lesson->students ?? []
        ], 200);
    }

    public function getStudentsForTeacher($teacherId)
    {
        // Step 1: Fetch all lessons by the teacher
        $lessonIds = Lesson::where('teacher_id', $teacherId)->pluck('id'); // Get lesson IDs only

        // Step 2: Fetch students enrolled in any of these lessons
        $students = Student::whereHas('enrollments', function ($query) use ($lessonIds) {
            $query->whereIn('lesson_id', $lessonIds);
        })->with('enrollments')->get();

        // Return the data in JSON format
        return response()->json(['students' => $students]);
    }

    // Attendance Report
    public function getTotalClassesHeld(Request $request, $lesson_id)
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $totalClasses = Attendance::where('lesson_id', $lesson_id)
            ->whereBetween('attendance_date', [$startDate, $endDate])
            ->distinct('attendance_date')
            ->count('attendance_date');

        return response()->json(['totalClasses' => $totalClasses]);
    }

    public function getTotalStudents($lesson_id)
    {
        $totalStudents = Attendance::where('lesson_id', $lesson_id)
            ->distinct('student_id')
            ->count('student_id');

        return response()->json(['totalStudents' => $totalStudents]);
    }

    public function getAverageAttendanceRate(Request $request, $lesson_id)
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        // Fetch attendance data grouped by date
        $attendanceData = Attendance::selectRaw('attendance_date, COUNT(*) as total_attendance, SUM(attendance_status = "present") as total_present')
            ->where('lesson_id', $lesson_id)
            ->whereBetween('attendance_date', [$startDate, $endDate])
            ->groupBy('attendance_date')
            ->get();

        // Total students enrolled for the lesson
        $totalStudents = Attendance::where('lesson_id', $lesson_id)
            ->distinct('student_id')
            ->count('student_id');

        // Prepare response data with attendance rate per date
        $data = $attendanceData->map(function ($item) use ($totalStudents) {
            // Calculate daily attendance rate
            $dailyAttendanceRate = $totalStudents > 0
                ? ($item->total_present / ($totalStudents)) * 100
                : 0;

            return [
                'date' => $item->attendance_date,
                'attendanceRate' => $dailyAttendanceRate
            ];
        });

        // Calculate average attendance rate over all dates in the range
        $averageAttendanceRate = $data->avg('attendanceRate');

        return response()->json([
            'averageAttendanceRate' => $averageAttendanceRate,
            'attendanceRatesByDate' => $data
        ]);
    }

    public function getStudentAbsences(Request $request, $lesson_id)
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        // Validate that the date range and lesson ID are provided
        if (!$startDate || !$endDate || !$lesson_id) {
            return response()->json(['error' => 'Invalid request. Please provide a lesson ID and date range.'], 400);
        }

        // Fetch each student's absence count for the specified lesson and date range
        $absences = Attendance::where('lesson_id', $lesson_id)
            ->whereBetween('attendance_date', [$startDate, $endDate])
            ->where('attendance_status', 'absent') // Assuming 'absent' marks absence
            ->select('student_id', DB::raw('count(*) as absence_count'))
            ->groupBy('student_id')
            ->with('student') // Assuming 'student' is a defined relationship in the Attendance model
            ->get();

        // Format the absence data to include student names and absence counts
        $absenceData = $absences->map(function ($record) {
            return [
                'student_name' => $record->student->name,
                'absence_count' => $record->absence_count,
            ];
        });

        return response()->json(['absenceData' => $absenceData]);
    }

    public function getStudentAttendanceCount(Request $request, $lesson_id)
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        // Validate that the date range and lesson ID are provided
        if (!$startDate || !$endDate || !$lesson_id) {
            return response()->json(['error' => 'Invalid request. Please provide a lesson ID and date range.'], 400);
        }

        // Fetch each student's absence count for the specified lesson and date range
        $absences = Attendance::where('lesson_id', $lesson_id)
            ->whereBetween('attendance_date', [$startDate, $endDate])
            ->where('attendance_status', 'absent') // Assuming 'absent' marks absence
            ->select('student_id', DB::raw('count(*) as absence_count'))
            ->groupBy('student_id')
            ->with('student') // Ensure 'student' is a defined relationship in the Attendance model
            ->get();

        // Fetch each student's presence count for the specified lesson and date range
        $presences = Attendance::where('lesson_id', $lesson_id)
            ->whereBetween('attendance_date', [$startDate, $endDate])
            ->where('attendance_status', 'present') // Assuming 'present' marks presence
            ->select('student_id', DB::raw('count(*) as present_count'))
            ->groupBy('student_id')
            ->with('student') // Ensure 'student' is a defined relationship in the Attendance model
            ->get();

        // Combine absences and presences for each student
        $attendanceData = $absences->map(function ($record) use ($presences) {
            $studentId = $record->student_id;

            // Find the corresponding presence count
            $presenceRecord = $presences->firstWhere('student_id', $studentId);
            $presentCount = $presenceRecord ? $presenceRecord->present_count : 0;

            return [
                'student_name' => $record->student->name,
                'absence_count' => $record->absence_count,
                'present_count' => $presentCount,
            ];
        });

        // Add students who were only present and not absent
        $presences->each(function ($presenceRecord) use (&$attendanceData, $absences) {
            $studentId = $presenceRecord->student_id;

            // If this student is not already in the attendance data
            if (!$absences->contains('student_id', $studentId)) {
                $attendanceData->push([
                    'student_name' => $presenceRecord->student->name,
                    'absence_count' => 0,
                    'present_count' => $presenceRecord->present_count,
                ]);
            }
        });

        return response()->json(['attendanceData' => $attendanceData]);
    }

    public function getStudentAttendanceDetails(Request $request, $lesson_id)
    {
        // Define the date range with defaults
        $startDate = $request->query('start_date') ?? now()->startOfMonth()->toDateString();
        $endDate = $request->query('end_date') ?? now()->endOfMonth()->toDateString();

        // Fetch total absences grouped by student
        $absences = Attendance::where('lesson_id', $lesson_id)
            ->whereBetween('attendance_date', [$startDate, $endDate])
            ->where('attendance_status', 'absent')
            ->select('student_id', DB::raw('count(*) as absence_count'))
            ->groupBy('student_id')
            ->with('student') // Assumes 'student' is a defined relationship in Attendance
            ->get()
            ->keyBy('student_id'); // Make it easier to lookup absences by student_id

        // Fetch total presence and associated student information
        $students = DB::table('students')
            ->join('enrollments', 'students.id', '=', 'enrollments.student_id')
            ->where('enrollments.lesson_id', $lesson_id)
            ->select('students.id', 'students.name')
            ->distinct()
            ->get();

        // Prepare attendance details
        $studentAttendanceDetails = $students->map(function ($student) use ($absences, $lesson_id, $startDate, $endDate) {
            // Count total present days
            $totalPresentDays = Attendance::where('lesson_id', $lesson_id)
                ->where('student_id', $student->id)
                ->whereBetween('attendance_date', [$startDate, $endDate])
                ->where('attendance_status', 'present')
                ->count();

            // Retrieve absence count from pre-fetched data
            $totalAbsentDays = $absences->has($student->id) ? $absences[$student->id]->absence_count : 0;

            // Calculate totals and averages
            $totalDays = $totalPresentDays + $totalAbsentDays;
            $averageAttendanceRate = $totalDays > 0 ? ($totalPresentDays / $totalDays) * 100 : 0;

            return [
                'id' => $student->id,
                'name' => $student->name,
                'totalPresentDays' => $totalPresentDays,
                'totalAbsentDays' => $totalAbsentDays,
                'averageAttendanceRate' => round($averageAttendanceRate, 2),
            ];
        });

        return response()->json($studentAttendanceDetails);
    }

    // Announcement
    public function getLessonsByAnnouncement($id)
    {
        $lessons = Lesson::with('subject')
            ->join('subjects', 'lessons.subject_id', '=', 'subjects.id')
            ->join('study_level', 'subjects.level_id', '=', 'study_level.id')
            ->join('teachers', 'lessons.teacher_id', '=', 'teachers.id')
            ->join('users', 'teachers.user_id', '=', 'users.id')
            ->join('recipients', 'lessons.id', '=', 'recipients.lesson_id')
            ->where('recipients.announcement_id', $id)
            ->select('lessons.*', 'subjects.subject_name', 'study_level.level_name', 'users.name')
            ->get();

        return response()->json([
            'status' => 200,
            'lessons' => $lessons,
        ]);
    }


}




