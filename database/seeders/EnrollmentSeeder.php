<?php

namespace Database\Seeders;

use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\Student;
use Illuminate\Database\Seeder;

class EnrollmentSeeder extends Seeder
{
    public function run(): void
    {
        // // Retrieve all students and lessons
        // $students = Student::all();

        // // Eager-load the subject relationship
        // $lessons = Lesson::with('subject')->get();

        // if ($students->isEmpty() || $lessons->isEmpty()) {
        //     echo "Please seed students and lessons before seeding enrollments.\n";
        //     return;
        // }

        // // Ensure each student gets unique subjects
        // foreach ($students as $student) {
        //     // Track subjects already assigned to the student
        //     $assignedSubjectIds = [];

        //     // Enroll each student in 1 to 3 unique subjects
        //     $lessonCount = rand(1, 3);

        //     // Filter out already assigned subjects
        //     $availableLessons = $lessons->filter(function ($lesson) use ($assignedSubjectIds) {
        //         return !in_array($lesson->subject_id, $assignedSubjectIds) && $lesson->id !== 4; // exclude 4th lesson for announcement testing
        //     });

        //     // Pick random lessons from the remaining available lessons
        //     $selectedLessons = $availableLessons->random(min($lessonCount, $availableLessons->count()));

        //     foreach ($selectedLessons as $lesson) {
        //         if ($lesson->subject && $lesson->subject->id && $lesson->subject->level_id) {
        //             Enrollment::create([
        //                 'student_id' => $student->id,
        //                 'subject_id' => $lesson->subject->id,
        //                 'study_level_id' => $lesson->subject->level_id,
        //                 'lesson_id' => $lesson->id,
        //             ]);

        //             // Track the subject to avoid duplicates
        //             $assignedSubjectIds[] = $lesson->subject->id;
        //         }
        //     }
        // }

        // Enrollment for student 1
        Enrollment::create([
            'student_id' => 1,
            'subject_id' => 1,
            'study_level_id' => 1,
            'lesson_id' => 4,
        ]);

        Enrollment::create([
            'student_id' => 1,
            'subject_id' => 2,
            'study_level_id' => 2,
            'lesson_id' => 2,
        ]);

        // Enrollment for student 2
        Enrollment::create([
            'student_id' => 2,
            'subject_id' => 1,
            'study_level_id' => 1,
            'lesson_id' => 1,
        ]);

        // Enrollment for student 3
        Enrollment::create([
            'student_id' => 3,
            'subject_id' => 2,
            'study_level_id' => 2,
            'lesson_id' => 2,
        ]);

        Enrollment::create([
            'student_id' => 3,
            'subject_id' => 4,
            'study_level_id' => 4,
            'lesson_id' => 3,
        ]);

        // Enrollment for student 4
        Enrollment::create([
            'student_id' => 4,
            'subject_id' => 1,
            'study_level_id' => 1,
            'lesson_id' => 1,
        ]);

        // Enrollment for student 5
        Enrollment::create([
            'student_id' => 5,
            'subject_id' => 3,
            'study_level_id' => 3,
            'lesson_id' => 3,
        ]);

        Enrollment::create([
            'student_id' => 5,
            'subject_id' => 4,
            'study_level_id' => 4,
            'lesson_id' => 1,
        ]);

        // Enrollment for student 6
        Enrollment::create([
            'student_id' => 6,
            'subject_id' => 2,
            'study_level_id' => 2,
            'lesson_id' => 2,
        ]);

        // Enrollment for student 7
        Enrollment::create([
            'student_id' => 7,
            'subject_id' => 1,
            'study_level_id' => 1,
            'lesson_id' => 1,
        ]);

        Enrollment::create([
            'student_id' => 7,
            'subject_id' => 4,
            'study_level_id' => 4,
            'lesson_id' => 2,
        ]);

        // Enrollment for student 8
        Enrollment::create([
            'student_id' => 8,
            'subject_id' => 3,
            'study_level_id' => 3,
            'lesson_id' => 3,
        ]);

        // Enrollment for student 9
        Enrollment::create([
            'student_id' => 9,
            'subject_id' => 1,
            'study_level_id' => 1,
            'lesson_id' => 1,
        ]);

        Enrollment::create([
            'student_id' => 9,
            'subject_id' => 2,
            'study_level_id' => 2,
            'lesson_id' => 2,
        ]);
    }
}

