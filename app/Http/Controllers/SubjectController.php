<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subject;

class SubjectController extends Controller
{
    public function index()
    {
        $subjects = Subject::join('study_level', 'subjects.level_id', '=', 'study_level.id')
            ->select('subjects.id', 'subjects.subject_name', 'subjects.level_id', 'study_level.level_name', 'subjects.subject_fee')
            ->get();

        return response()->json([
            'status' => 200,
            'subjects' => $subjects
        ]);
    }

    public function addSubject(Request $request)
    {
        $subject = new Subject();
        $subject->subject_name = $request->input('subjectName');
        $subject->level_id = $request->input('levelId');
        $subject->subject_fee = $request->input('subjectFee');
        $subject->save();

        return response()->json([
            'status' => 200,
            'message' => 'Subject added successfully'
        ]);
    }

    public function deleteSubject($id)
    {
        $subject = Subject::find($id);

        if ($subject) {
            $subject->delete();
            return response()->json(['status' => 200, 'message' => 'Subject deleted successfully.']);
        }

        return response()->json(['status' => 404, 'message' => 'Subject not found.'], 404);
    }
}
