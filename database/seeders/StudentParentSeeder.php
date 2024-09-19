<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\Parents;

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

        // Attach parents to each student
        foreach ($students as $student) {
            $student->parents()->attach(
                $parents->random(rand(1, 3))->pluck('id')->toArray()
            );
        }
    }
}