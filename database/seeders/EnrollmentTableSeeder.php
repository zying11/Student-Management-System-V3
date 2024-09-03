<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\Lesson;

class EnrollmentTableSeeder extends Seeder
{
    public function run()
    {
        $students = Student::all();
        $lessons = Lesson::all();

        foreach ($students as $student) {
            // Enroll each student in 1-3 random lessons
            $randomLessons = $lessons->random(rand(1, 3));

            foreach ($randomLessons as $lesson) {
                $student->lesson()->attach($lesson->id);
            }
        }
      
    }
}
