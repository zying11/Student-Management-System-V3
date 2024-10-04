<?php

// namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
// use Illuminate\Database\Seeder;
// use App\Models\Enrollment;
// use App\Models\Lesson;
// use App\Models\Student;

// class EnrollmentSeeder extends Seeder
// {
//     /**
//      * Run the database seeds.
//      */
//     public function run(): void
//     {
//         // Use students that are already in the database
//         $students = Student::all();

//         // Use lessons that are already in the database
//         $lessons = Lesson::all();

//         if ($students->isEmpty() || $lessons->isEmpty()) {
//             echo "Please seed students and lessons before seeding enrollments.\n";
//             return;
//         }

//         // Ensure each student has at least one enrollment
//         foreach ($students as $student) {
//             // Pick a random lesson for each student
//             $lesson = $lessons->random();
//             Enrollment::factory()->create([
//                 'student_id' => $student->id,
//                 'subject_id' => $lesson->subject_id,
//                 'study_level_id' => $lesson->subject->level_id,
//                 'lesson_id' => $lesson->id,
//             ]);
//         }

//         // Create additional enrollments for variability
//         Enrollment::factory()->count(10)->create();
//     }
// }


namespace Database\Seeders;

use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\Student;
use Illuminate\Database\Seeder;

class EnrollmentSeeder extends Seeder
{
    public function run(): void
    {
        // Retrieve all students and lessons
        $students = Student::all();
        
        // Eager-load the subject relationship
        $lessons = Lesson::with('subject')->get(); 

        if ($students->isEmpty() || $lessons->isEmpty()) {
            echo "Please seed students and lessons before seeding enrollments.\n";
            return;
        }

        // Ensure each student gets unique subjects
        foreach ($students as $student) {
            // Track subjects already assigned to the student
            $assignedSubjectIds = [];

            // Enroll each student in 1 to 3 unique subjects
            $lessonCount = rand(1, 3);

            // Filter out already assigned subjects
            $availableLessons = $lessons->filter(function ($lesson) use ($assignedSubjectIds) {
                return !in_array($lesson->subject_id, $assignedSubjectIds);
            });

            // Pick random lessons from the remaining available lessons
            $selectedLessons = $availableLessons->random(min($lessonCount, $availableLessons->count()));

            foreach ($selectedLessons as $lesson) {
                if ($lesson->subject && $lesson->subject->id && $lesson->subject->level_id) {
                    Enrollment::create([
                        'student_id' => $student->id,
                        'subject_id' => $lesson->subject->id,
                        'study_level_id' => $lesson->subject->level_id,
                        'lesson_id' => $lesson->id,
                    ]);

                    // Track the subject to avoid duplicates
                    $assignedSubjectIds[] = $lesson->subject->id;
                }
            }
        }
    }
}

