<?php

// namespace App\Http\Controllers;

// use App\Http\Requests\StoreStudentRequest;
// use App\Http\Requests\UpdateStudentRequest;
// use App\Http\Resources\StudentResource;
// use App\Models\Student;

// class StudentController extends Controller
// {
//     /**
//      * Display a listing of the resource.
//      */
//     public function index()
//     {
//         return StudentResource::collection(
//             Student::query()->orderBy('id', 'desc')->get()
//         );
//     }

//     /**
//      * Store a newly created resource in storage.
//      */
//     public function store(StoreStudentRequest $request)
//     {
//         $student = Student::create($request->validated());
//         return response()->json($student, 201);
//     }

//     // /**
//     //  * Display the specified resource.
//     //  */
//     // public function show(Student $student)
//     // {
//     //     return new StudentResource($student);
//     // }
//     public function show($id)
// {
//     $student = Student::with('enrollments')->findOrFail($id);
//     return response()->json($student);
// }

//     /**
//      * Update the specified resource in storage.
//      */
//     public function update(UpdateStudentRequest $request, Student $student)
//     {
//         $student->update($request->validated());
//         return response()->json($student, 200);
//     }

//     /**
//      * Remove the specified resource from storage.
//      */
//     public function destroy(Student $student)
//     {
//         $student->delete();
//         return response()->json(null, 204);
//     }
// }


namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Parents;
use App\Models\Enrollment;
use App\Http\Resources\StudentResource;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use Illuminate\Http\Request;
use Carbon\Carbon;

class StudentController extends Controller
{
    /**
     * Display a listing of the students.
     */
    public function index()
    {
        // Retrieve all students 
        $students = Student::query()->orderBy('id', 'desc')->get();

        return StudentResource::collection($students);
    }

    /**
     * Store a newly created student in storage.
     */
    public function store(StoreStudentRequest $request)
    {
        // Validate the incoming request using store student request class
        $validatedData = $request->validated();

        // Parse the birth_date from the validated data and calculate the age
        $birthDate = Carbon::parse($validatedData['birth_date']);
        $age = $birthDate->age;

        // Add the calculated age to the validated data
        $validatedData['age'] = $age;

        // Create a new student record using the validated data
        $student = Student::create($validatedData);

        return new StudentResource($student);
    }

    /**
     * Display the specified student.
     */
    public function show($id)
    {
        // Find the student by ID
        $student = Student::findOrFail($id);

        return new StudentResource($student);
    }

    /**
     * Update the specified student in storage.
     */
    public function update(UpdateStudentRequest $request, $id)
    {
        // Find the student by ID
        $student = Student::findOrFail($id);

        // Validate the incoming request using update student request class
        $validatedData = $request->validated();

        // Parse the birth_date from the validated data and calculate the age
        $birthDate = Carbon::parse($validatedData['birth_date']);
        $validatedData['age'] = $birthDate->age;

        // Update the student record with the validated data
        $student->update($validatedData);

        return new StudentResource($student);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Find the student by ID
        $student = Student::findOrFail($id);

        // Delete the student details
        $student->delete();

        return response('', 204);
    }

    public function addParents(Request $request)
    {
        $studentId = $request->input('student_id');
        $parentIds = $request->input('parent_ids');

        // Find the student by ID
        $student = Student::find($studentId);

        if (!$student) {
            return response()->json(['error' => 'Student not found'], 404);
        }

        if (is_array($parentIds)) {
            $student->parents()->sync($parentIds);
            return response()->json(['message' => 'Parents updated successfully']);
        } else {
            return response()->json(['error' => 'Invalid parent IDs format'], 400);
        }
    }


    public function removeParent(Student $student, Parents $parent)
    {
        $student->parents()->detach($parent->id);
        return response()->json(['message' => 'Parent removed successfully']);
    }

    public function getParents(Student $student)
    {
        // Check if the student exists
        if (!$student) {
            return response()->json(['error' => 'Student not found'], 404);
        }

        // Return parents associated with the student
        return response()->json($student->parents);
    }
}
