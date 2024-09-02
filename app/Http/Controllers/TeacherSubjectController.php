<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTeacherSubjectRequest;
use App\Http\Requests\UpdateTeacherSubjectRequest;
use App\Models\Teacher;

class TeacherSubjectController extends Controller
{
    /**
     * Store subjects for a teacher.
     */
    public function store(StoreTeacherSubjectRequest $request)
    {
        // Find the teacher by ID
        $teacher = Teacher::findOrFail($request->teacher_id);

        // Sync subject teaching 
        $teacher->subject()->sync($request->subject_ids);

        return response()->json(['message' => 'Subjects assigned successfully']);
    }

    /**
     * Update subjects for a teacher.
     */
    public function update(UpdateTeacherSubjectRequest $request, $id)
    {
        // Find the teacher by ID
        $teacher = Teacher::findOrFail($id);

        // Sync subject teaching 
        $teacher->subject()->sync($request->subject_ids);

        return response()->json(['message' => 'Subjects updated successfully']);
    }

    /**
     * Get subjects assigned to a teacher.
     */
    public function show($id)
    {
        // Find the teacher by ID
        $teacher = Teacher::findOrFail($id);

        // Get the subject IDs assigned to the teacher
        $subjectIds = $teacher->subject->pluck('id');

        return response()->json(['subjects' => $subjectIds]);
    }
}
