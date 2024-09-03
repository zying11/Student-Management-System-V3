<?php

// namespace App\Http\Controllers;

// use App\Models\Enrollment;
// use App\Models\Student;
// use Illuminate\Http\Request;

// class EnrollmentController extends Controller
// {
//     public function index(Student $student)
//     {
//         return response()->json($student->enrollments);
//     }

//     // public function store(Request $request, Student $student)
//     // {
//     //     $request->validate([
//     //         'subject' => 'required|string|max:255',
//     //         'study_level' => 'required|string|max:255',
//     //     ]);

//     //     $enrollment = new Enrollment([
//     //         'subject' => $request->input('subject'),
//     //         'study_level' => $request->input('study_level'),
//     //     ]);

//     //     $student->enrollments()->save($enrollment);

//     //     return response()->json($enrollment, 201);
//     // }
//     public function store(Request $request, Student $student)
//     {
//         $request->validate([
//             'subject' => 'required|string|max:255',
//             'study_level' => 'required|string|max:255',
//             'class_time' => 'required|string|max:255', // Add validation for class_time
//         ]);
    
//         $enrollment = new Enrollment([
//             'subject' => $request->input('subject'),
//             'study_level' => $request->input('study_level'),
//             'class_time' => $request->input('class_time'), // Add class_time to the enrollment
//         ]);
    
//         $student->enrollments()->save($enrollment);
    
//         return response()->json($enrollment, 201);
//     }
    

// }


namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Lesson;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'lessons' => 'required|array',
            'lessons.*.lesson_id' => 'required|exists:lessons,id',
        ]);

        $student = Student::find($validated['student_id']);
        $enrollments = collect($validated['lessons'])->map(function ($lesson) {
            return [
                'lesson_id' => $lesson['lesson_id'],
            ];
        });

        $student->lesson()->sync($enrollments->keyBy('lesson_id')->toArray(), false);
        return response()->json(['message' => 'Student enrolled in lessons successfully.']);
    }
}
