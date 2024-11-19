<?php

namespace Database\Seeders;

use App\Models\Lesson;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LessonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Lesson::factory()->count(3)->create();
        Lesson::create([
            'subject_id' => 1,
            'teacher_id' => 2,
            'room_id' => 1,
            'duration' => 1.0,
            'day' => 1,
            'start_time' => "10:00:00",
            'end_time' => "11:00:00",
        ]);
        Lesson::create([
            'subject_id' => 2,
            'teacher_id' => 2,
            'room_id' => 2,
            'duration' => 1.0,
            'day' => 2,
            'start_time' => "13:00:00",
            'end_time' => "14:00:00",
        ]);

        Lesson::create([
            'subject_id' => 3,
            'teacher_id' => 1,
            'room_id' => 3,
            'duration' => 1.5,
            'day' => 3,
            'start_time' => "12:00:00",
            'end_time' => "13:30:00",
        ]);

        Lesson::create([
            'subject_id' => 4,
            'teacher_id' => 1,
            'room_id' => 1,
            'duration' => 1.0,
            'day' => 3,
            'start_time' => "15:00:00",
            'end_time' => "14:00:00",
        ]);


    }
}
