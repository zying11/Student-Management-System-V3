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
    public function addNewLesson(Request $request)
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
    public function updateLesson(Request $request)
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
        $lesson->day = $request->input('day');
        $lesson->start_time = $request->input('startTime');
        $lesson->end_time = $request->input('endTime');

        $lesson->save();

        return response()->json([
            'status' => 200,
            'message' => 'Date and time updated for lesson successfully',
            'lesson' => $lesson, // Optionally return the updated lesson data
        ]);
    }

}

