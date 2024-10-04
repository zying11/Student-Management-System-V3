<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function getStudentCount()
    {
        $studentCount = \App\Models\Student::count();
        return response()->json(['count' => $studentCount]);
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
