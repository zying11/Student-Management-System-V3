<?php

// namespace App\Http\Controllers;

// use App\Http\Requests\StoreEnrollmentRequest;
// use Illuminate\Http\Request;
// use App\Models\Enrollment;
// use App\Models\Subject;

// class EnrollmentController extends Controller
// {
//     /**
//      * Display a listing of enrollments.
//      */
//     public function index()
//     {
//         $enrollments = Enrollment::all();
//         return response()->json($enrollments);
//     }

//     /**
//      * Store a newly created enrollment details in storage.
//      */
//     public function store(StoreEnrollmentRequest $request)
//     {
//         $validatedData = $request->validate([
//             'student_id' => 'required|exists:students,id',
//             'subject_id' => 'required|exists:subjects,id',
//             'study_level_id' => 'required|exists:study_level,id',
//             'lesson_id' => 'required|exists:lessons,id',
//         ]);

//         // Check if the study level is valid for the subject
//         $subject = Subject::find($request->subject_id);
//         if (!$subject) {
//             return response()->json(['error' => 'Subject not found.'], 404);
//         }

//         $validStudyLevels = $subject->studyLevel()->pluck('id')->toArray();

//         if (!in_array($request->study_level_id, $validStudyLevels)) {
//             return response()->json(['error' => 'The selected study level is not valid for this subject.'], 422);
//         }

//         // Create the enrollment
//         Enrollment::create($validatedData);

//         return response()->json(['success' => 'Enrollment created successfully.']);
//     }

//      /**
//      * Update the specified student's enrollment details in storage.
//      */
//     public function update(Request $request, $id)
//     {
//         $validatedData = $request->validate([
//             'student_id' => 'required|exists:students,id',
//             'subject_id' => 'required|exists:subjects,id',
//             'study_level_id' => 'required|exists:study_level,id',
//             'lesson_id' => 'required|exists:lessons,id',
//         ]);

//         // Check if the study level is valid for the subject
//         $subject = Subject::find($request->subject_id);
//         if (!$subject) {
//             return response()->json(['error' => 'Subject not found.'], 404);
//         }

//         $validStudyLevels = $subject->studyLevel()->pluck('id')->toArray();

//         if (!in_array($request->study_level_id, $validStudyLevels)) {
//             return response()->json(['error' => 'The selected study level is not valid for this subject.'], 422);
//         }

//         // Update the enrollment
//         $enrollment = Enrollment::findOrFail($id);
//         $enrollment->update($validatedData);

//         return response()->json(['success' => 'Enrollment updated successfully.']);
//     }

//     /**
//      * Remove the specified resource from storage.
//      */
//     public function destroy($id)
//     {
//         $enrollment = Enrollment::find($id);

//         if ($enrollment) {
//             $enrollment->delete();
//             return response()->json(['message' => 'Enrollment deleted successfully'], 200);
//         } else {
//             return response()->json(['message' => 'Enrollment not found'], 404);
//         }
//     }
// }

namespace App\Http\Controllers;

use App\Http\Requests\StoreEnrollmentRequest;
use App\Http\Requests\UpdateEnrollmentRequest;
use App\Http\Resources\EnrollmentResource;
use App\Models\Enrollment;
use App\Models\Subject;

class EnrollmentController extends Controller
{
    /**
     * Display a listing of enrollments.
     */
    public function index()
    {
        // Retrieve all enrollments
        $enrollments = Enrollment::all();

        return EnrollmentResource::collection($enrollments);
    }

    /**
     * Store a newly created enrollment details in storage.
     */
    public function store(StoreEnrollmentRequest $request)
    {
        // Validate the incoming request using store enrollment request class
        $validatedData = $request->validated();

        // Check if the study level is valid for the subject
        $subject = Subject::find($request->subject_id);
        if (!$subject) {
            return response()->json(['error' => 'Subject not found.'], 404);
        }
        $validStudyLevels = $subject->studyLevel()->pluck('id')->toArray();
        if (!in_array($request->study_level_id, $validStudyLevels)) {
            return response()->json(['error' => 'The selected study level is not valid for this subject.'], 422);
        }

        // Create enrollment
        $enrollment = Enrollment::create($validatedData);

        return new EnrollmentResource($enrollment);
    }

    /**
     * Display the specified enrollment.
     */
    public function show($id)
    {
        // Find the enrollment by ID
        $enrollment = Enrollment::findOrFail($id);

        return new EnrollmentResource($enrollment);
    }

    /**
     * Update the specified student's enrollment details in storage.
     */
    public function update(UpdateEnrollmentRequest $request, $id)
    {
        // Validate the incoming request using update enrollment request class
        $validatedData = $request->validated();

        // Check if the study level is valid for the subject
        $subject = Subject::find($request->subject_id);
        if (!$subject) {
            return response()->json(['error' => 'Subject not found.'], 404);
        }
        $validStudyLevels = $subject->studyLevel()->pluck('id')->toArray();
        if (!in_array($request->study_level_id, $validStudyLevels)) {
            return response()->json(['error' => 'The selected study level is not valid for this subject.'], 422);
        }

        // Update the enrollment
        $enrollment = Enrollment::findOrFail($id);
        $enrollment->update($validatedData);

        return new EnrollmentResource($enrollment);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Find the enrollment by ID
        $enrollment = Enrollment::find($id);

        // Delete the enrollment details
        if ($enrollment) {
            $enrollment->delete();
            return response()->json(['message' => 'Enrollment deleted successfully'], 204);
        } else {
            return response()->json(['message' => 'Enrollment not found'], 404);
        }
    }

    public function getEnrollmentsByStudent($student_id)
    {
        // Fetch enrollments with related student, subject with studyLevel, lesson, and teacher data
        $enrollments = Enrollment::with([
            'student',
            'lesson.subject.studyLevel', // Use camel case to match the relationship method name
            'lesson.teacher.user'
        ])
            ->where('student_id', $student_id)
            ->get();

        return response()->json($enrollments);
    }

}