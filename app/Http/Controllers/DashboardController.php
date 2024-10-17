<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function getStudentCount()
    {
        // Total student count
        $studentCount = \App\Models\Student::count();

        // Male student count
        $maleCount = \App\Models\Student::where('gender', 'male')->count();

        // Female student count
        $femaleCount = \App\Models\Student::where('gender', 'female')->count();

        // Return the data as a JSON response
        return response()->json([
            'total' => $studentCount,
            'male' => $maleCount,
            'female' => $femaleCount,
        ]);
    }


    public function getTeacherCount()
    {
        $teacherCount = \App\Models\Teacher::count();
        return response()->json(['count' => $teacherCount]);
    }

    public function getRoomCount()
    {
        $roomCount = \App\Models\Room::count();
        return response()->json(['count' => $roomCount]);
    }

    public function getSubjectCount()
    {
        $subjectCount = \App\Models\Subject::count();
        return response()->json(['count' => $subjectCount]);
    }


}
