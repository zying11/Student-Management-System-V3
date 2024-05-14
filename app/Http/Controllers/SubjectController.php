<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subject;

class SubjectController extends Controller
{
    public function index()
    {
        $subjects = Subject::all();
        return response()->json([
            'status' => 200,
            'subjects' => $subjects
        ]);
    }

    public function addSubject(Request $request)
    {
        $subject = new Subject();
        $subject->subject_code = $request->input('subjectCode');
        $subject->subject_name = $request->input('subjectName');
        $subject->save();

        return response()->json([
            'status' => 200,
            'message' => 'Subject added successfully'
        ]);
    }
}
