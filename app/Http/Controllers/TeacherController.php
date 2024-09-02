<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Http\Resources\TeacherResource;
use App\Http\Requests\StoreTeacherRequest;
use App\Http\Requests\UpdateTeacherRequest;
use Carbon\Carbon;

class TeacherController extends Controller
{
    /**
     * Display a listing of the teachers.
     */
    public function index()
    {
        // Retrieve all teachers with their associated user details,
        // filtering only those users with the teacher role
        $teachers = Teacher::with([
            'user' => function ($query) {
                $query->where('role_id', 2);
            }
        ])->orderBy('id', 'desc')->get();

        // Return a collection of teachers as a resource
        return TeacherResource::collection($teachers);
    }

    /**
     * Store a newly created teacher in storage.
     */
    public function store(StoreTeacherRequest $request)
    {
        // Validate the incoming request using store teacher request class
        $validatedData = $request->validated();

        // Parse the birth_date from the validated data and calculate the age
        $birthDate = Carbon::parse($validatedData['birth_date']);
        $age = $birthDate->age;

        // Add the calculated age to the validated data
        $validatedData['age'] = $age;

        // Create a new teacher record using the validated data
        $teacher = Teacher::create($validatedData);

        // Sync subjects teaching 
        $teacher->subject()->sync($request->subject_ids);

        return new TeacherResource($teacher);
    }

    /**
     * Display the specified teacher.
     */
    public function show($id)
    {
        // Find the teacher by ID
        $teacher = Teacher::findOrFail($id);

        return new TeacherResource($teacher);
    }

    /**
     * Update the specified teacher in storage.
     */
    public function update(UpdateTeacherRequest $request, $id)
    {
        // Find the teacher by ID
        $teacher = Teacher::findOrFail($id);

        // Validate the incoming request using update teacher request class
        $validatedData = $request->validated();

        // Parse the birth_date from the validated data and calculate the age
        $birthDate = Carbon::parse($validatedData['birth_date']);
        $validatedData['age'] = $birthDate->age;

        // Update the teacher record with the validated data
        $teacher->update($validatedData);

        // Sync subjects teaching
        $teacher->subject()->sync($request->subject_ids);

        return new TeacherResource($teacher);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Find the teacher by ID
        $teacher = Teacher::findOrFail($id);

        // Delete the associated user
        $teacher->user()->delete();

        // Delete the teacher details
        $teacher->delete();

        return response('', 204);
    }
}
