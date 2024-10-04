<?php

// namespace Database\Factories;

// use App\Models\Enrollment;
// use App\Models\Lesson;
// use App\Models\Student;
// use Illuminate\Database\Eloquent\Factories\Factory;

// class EnrollmentFactory extends Factory
// {
//     /**
//      * The name of the factory's corresponding model.
//      *
//      * @var string
//      */
//     protected $model = Enrollment::class;

//     /**
//      * Define the model's default state.
//      *
//      * @return array
//      */
//     public function definition()
//     {

//         $students = Student::all();
//         $lessons = Lesson::all();

//         if ($students->isEmpty() || $lessons->isEmpty()) {
//             throw new \Exception('No students or lessons available for seeding enrollments.');
//         }

//         // Pick a random lesson to ensure subject and study level match
//         $lesson = $lessons->random();

//         return [
//             'student_id' => $students->random()->id,
//             'subject_id' => $lesson->subject_id,
//             'study_level_id' => $lesson->subject->level_id,
//             'lesson_id' => $lesson->id,
//         ];
//     }
// }

namespace Database\Factories;

use App\Models\Enrollment;
use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

class EnrollmentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Enrollment::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'student_id' => Student::factory(), 
            'subject_id' => null,              
            'study_level_id' => null,         
            'lesson_id' => null,               
        ];
    }
}
