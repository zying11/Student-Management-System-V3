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
        // Use students that are already in the database
        $students = Student::all();

        if ($students->isEmpty()) {
            echo "No students found. Please run the StudentSeeder first.\n";
            return;
        }

        // Use parents that are already in the database
        $parents = Parents::all();

        if ($parents->isEmpty()) {
            echo "No parents found. Please run the ParentsSeeder first.\n";
            return;
        }

        StudentParent::create([
            'student_id' => 1,
            'parent_id' => 16,
        ]);


        StudentParent::create([
            'student_id' => 1,
            'parent_id' => 17,
        ]);

        // Attach parents to each student
        foreach ($students as $student) {
            // Skip student with ID 1
            if ($student->id === 1) {
                continue;
            }

            // Randomly attach 1 to 3 parents to the student
            $student->parents()->attach(
                $parents->random(rand(1, 3))->pluck('id')->toArray()
            );
        }

    }
}