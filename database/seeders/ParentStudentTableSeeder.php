<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\Parents;
use Faker\Factory as Faker;

class ParentStudentTableSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        $students = Student::all();
        $parents = Parents::all();

        foreach ($students as $student) {
            // Attach 1-2 random parents to each student
            $student->parent()->attach(
                $parents->random(rand(1, 2))->pluck('id')->toArray()
            );
        }
    }
}
