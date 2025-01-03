<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\Parents;
use App\Models\StudentParent;

class StudentParentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // // Use students that are already in the database
        // $students = Student::all();

        // if ($students->isEmpty()) {
        //     echo "No students found. Please run the StudentSeeder first.\n";
        //     return;
        // }

        // // Use parents that are already in the database
        // $parents = Parents::all();

        // if ($parents->isEmpty()) {
        //     echo "No parents found. Please run the ParentsSeeder first.\n";
        //     return;
        // }

        // // Attach parents to each student
        // foreach ($students as $student) {
        //     // Skip student with ID 1
        //     if ($student->id === 1) {
        //         continue;
        //     }

        //     // Randomly attach 1 to 3 parents to the student
        //     $student->parents()->attach(
        //         $parents->random(rand(1, 3))->pluck('id')->toArray()
        //     );
        // }

        // Assign parents to student 1
        StudentParent::create([
            'student_id' => 1,
            'parent_id' => 1,
        ]);

        StudentParent::create([
            'student_id' => 1,
            'parent_id' => 2,
        ]);

        // Assign parents to student 2
        StudentParent::create([
            'student_id' => 2,
            'parent_id' => 18,
        ]);

        StudentParent::create([
            'student_id' => 2,
            'parent_id' => 19,
        ]);

        // Assign parents to student 3
        StudentParent::create([
            'student_id' => 3,
            'parent_id' => 20,
        ]);

        StudentParent::create([
            'student_id' => 3,
            'parent_id' => 4,
        ]);

        // Assign parents to student 4
        StudentParent::create([
            'student_id' => 4,
            'parent_id' => 1,
        ]);

        // Assign parents to student 5
        StudentParent::create([
            'student_id' => 5,
            'parent_id' => 2,
        ]);

        StudentParent::create([
            'student_id' => 5,
            'parent_id' => 3,
        ]);

        // Assign parents to student 6
        StudentParent::create([
            'student_id' => 6,
            'parent_id' => 7,
        ]);

        // Assign parents to student 7
        StudentParent::create([
            'student_id' => 7,
            'parent_id' => 8,
        ]);

        StudentParent::create([
            'student_id' => 7,
            'parent_id' => 10,
        ]);

        // Assign parents to student 8
        StudentParent::create([
            'student_id' => 8,
            'parent_id' => 11,
        ]);

        // Assign parents to student 9
        StudentParent::create([
            'student_id' => 9,
            'parent_id' => 13,
        ]);

        StudentParent::create([
            'student_id' => 9,
            'parent_id' => 12,
        ]);

        // Assign parents to student 10
        StudentParent::create([
            'student_id' => 10,
            'parent_id' => 15,
        ]);

        // Assign parents to student 11
        StudentParent::create([
            'student_id' => 11,
            'parent_id' => 16,
        ]);

        // Assign parents to student 12
        StudentParent::create([
            'student_id' => 12,
            'parent_id' => 17,
        ]);

        // Assign parents to student 13
        StudentParent::create([
            'student_id' => 13,
            'parent_id' => 18,
        ]);

        StudentParent::create([
            'student_id' => 13,
            'parent_id' => 19,
        ]);

        // Assign parents to student 14
        StudentParent::create([
            'student_id' => 14,
            'parent_id' => 2,
        ]);

        // Assign parents to student 15
        StudentParent::create([
            'student_id' => 15,
            'parent_id' => 3,
        ]);

        StudentParent::create([
            'student_id' => 15,
            'parent_id' => 1,
        ]);
    }
}