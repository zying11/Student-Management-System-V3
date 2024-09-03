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
        // Create a new Lesson instance and save to the database
        $lesson = new Lesson();
        $lesson->subject_id = $request->input('subjectId');
        $lesson->teacher_id = $request->input('teacher');
        $lesson->duration = $request->input('duration');
        $lesson->save();

        return response()->json([
            'status' => 200,
            'message' => 'Lesson added successfully'
        ]);
    }

    public function getLessons()
    {
        // Setting up the variable to hold the collection of Lesson objects
        $lessons = Lesson::with('subject')
            // Retrieve data from the subjects table related to each lesson
            ->join('subjects', 'lessons.subject_id', '=', 'subjects.id')
            // Retrieve data from the study_level table related to each subject
            ->join('study_level', 'subjects.level_id', '=', 'study_level.id')
            // Specifies which columns should be retrieved 
            ->select('lessons.*', 'subjects.subject_name', 'study_level.level_name')
            ->get();

        return response()->json([
            'status' => 200,
            'lessons' => $lessons
        ]);
    }

    // public function getTimetableLessons()
    // {
    //     $lessons = Lesson::with(['subject', 'room'])
    //         ->join('subjects', 'lessons.subject_id', '=', 'subjects.id')
    //         ->join('study_level', 'subjects.level_id', '=', 'study_level.id')
    //         ->join('rooms', 'lessons.room_id', '=', 'rooms.id')
    //         ->select('lessons.*', 'subjects.subject_name', 'study_level.level_name', 'rooms.id as room_id', 'rooms.room_name')
    //         ->get();

    //     return response()->json([
    //         'status' => 200,
    //         'lessons' => $lessons
    //     ]);
    // }

    public function getTimetableLessons(Request $request)
    {
        // Extracts the value of the room_id query parameter from the URL
        // `http://example.com/api/lessons?room_id=3`
        $roomId = $request->query('room_id');

        // If room_id is provided, filter lessons by room_id
        if ($roomId) {
            $lessons = Lesson::where('room_id', $roomId)
                ->with(['subject.studyLevel', 'room'])
                ->get();
        } else {
            // Otherwise, return all lessons with their related data
            $lessons = Lesson::with(['subject.studyLevel', 'room'])->get();
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
        $lesson->teacher_id = $request->input('teacher');
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


    public function destroy($id)
    {
        $lesson = Lesson::find($id);

        if ($lesson) {
            $lesson->delete();
            return response()->json(['status' => 200, 'message' => 'Lesson deleted successfully.']);
        }

        return response()->json(['status' => 404, 'message' => 'Lesson not found.'], 404);
    }


}

