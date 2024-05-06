<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lesson;

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
    public function store(Request $request)
    {
        // Validate incoming request data
        // $validatedData = $request->validate([
        //     'subject_name' => 'required|string',
        //     'level_id' => 'required|integer',
        //     'duration' => 'required|numeric',
        //     'day' => 'required|string',
        //     'start_time' => 'required|string',
        //     'end_time' => 'required|string',
        // ]);

        // Create a new Lesson instance and save to the database
        $lesson = new Lesson();
        $lesson->subject_name = $request->input('subjectName');
        $lesson->level_id = $request->input('studyLevel');
        $lesson->capacity = $request->input('capacity');
        $lesson->duration = $request->input('duration');
        $lesson->save();
        // $subject->day = $validatedData['day'];
        // $subject->start_time = $validatedData['start_time'];
        // $subject->end_time = $validatedData['end_time'];

        return response()->json([
            'status' => 200,
            'message' => 'Lesson added successfully'
        ]);
    }
}
