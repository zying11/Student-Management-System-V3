<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subject;

class SubjectController extends Controller
{
    public function index()
    {
        $subjects = Subject::join('study_level', 'subjects.level_id', '=', 'study_level.id')
            ->select('subjects.id', 'subjects.subject_name', 'subjects.level_id', 'study_level.level_name')
            ->get();

        return response()->json([
            'status' => 200,
            'subjects' => $subjects
        ]);
    }

    public function addSubject(Request $request)
    {
        $subject = new Subject();
        $subject->study_level = $request->input('studyLevel');
        $subject->subject_name = $request->input('subjectName');
        $subject->save();

        return response()->json([
            'status' => 200,
            'message' => 'Subject added successfully'
        ]);
    }
}
