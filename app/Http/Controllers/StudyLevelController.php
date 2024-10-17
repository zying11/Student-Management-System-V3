<?php

namespace App\Http\Controllers;

use App\Models\StudyLevel;
use Illuminate\Http\Request;

class StudyLevelController extends Controller
{
    public function index()
    {
        // Fetch all study levels from the database
        $studyLevels = StudyLevel::all();

        return response()->json([
            'status' => 200,
            'studyLevels' => $studyLevels
        ]);
    }


    public function addStudyLevel(Request $request)
    {
        $studyLevel = new StudyLevel();
        $studyLevel->level_name = $request->input('levelName');
        $studyLevel->save();

        return response()->json([
            'status' => 200,
            'message' => 'Study Level added successfully'
        ]);
    }

    public function deleteStudyLevel($id)
    {
        $studyLevel = StudyLevel::find($id);

        if ($studyLevel) {
            $studyLevel->delete();
            return response()->json(['status' => 200, 'message' => 'Study Level deleted successfully.']);
        }

        return response()->json(['status' => 404, 'message' => 'Study Level not found.'], 404);
    }
}

