<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Lesson;
use App\Models\Subject;
use App\Models\Room;
use Faker\Factory as Faker;

class LessonDummyZy extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        foreach (range(1, 10) as $index) {
            $subject = Subject::inRandomOrder()->first(); 
            $room = Room::inRandomOrder()->first(); 

            Lesson::create([
                'subject_id' => $subject->id,
                'teacher_id' => $faker->numberBetween(1, 10),
                'room_id' => $room->id,
                'duration' => $faker->numberBetween(1, 3),
                'day' => $faker->randomElement(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
                'start_time' => $faker->time('H:i'),
                'end_time' => $faker->time('H:i', '+1 hours'), // Set end time based on start time + duration
            ]);

            echo "Seeded Lesson: Subject - {$subject->subject_name}, Room - {$room->room_name}\n";
        }
    }
}