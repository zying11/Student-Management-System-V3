<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTeacherSubjectRequest;
use App\Http\Requests\UpdateTeacherSubjectRequest;
use App\Models\Teacher;
use App\Http\Resources\TeacherSubjectResource;

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
        // Find the teacher by ID and load associated subjects
        $teacher = Teacher::with('subject')->findOrFail($id);

        // Return the subject associated with the teacher using the TeacherSubjectResource
        return TeacherSubjectResource::collection($teacher->subject);
    }
}
