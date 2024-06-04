<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\Student;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function index(Student $student)
    {
        return response()->json($student->enrollments);
    }

    // public function store(Request $request, Student $student)
    // {
    //     $request->validate([
    //         'subject' => 'required|string|max:255',
    //         'study_level' => 'required|string|max:255',
    //     ]);

    //     $enrollment = new Enrollment([
    //         'subject' => $request->input('subject'),
    //         'study_level' => $request->input('study_level'),
    //     ]);

    //     $student->enrollments()->save($enrollment);

    //     return response()->json($enrollment, 201);
    // }
    public function store(Request $request, Student $student)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'study_level' => 'required|string|max:255',
            'class_time' => 'required|string|max:255', // Add validation for class_time
        ]);
    
        $enrollment = new Enrollment([
            'subject' => $request->input('subject'),
            'study_level' => $request->input('study_level'),
            'class_time' => $request->input('class_time'), // Add class_time to the enrollment
        ]);
    
        $student->enrollments()->save($enrollment);
    
        return response()->json($enrollment, 201);
    }
    

}