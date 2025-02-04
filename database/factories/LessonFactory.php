<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Lesson;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Lesson>
 */
class LessonFactory extends Factory
{
    protected $model = Lesson::class;

    public function definition()
    {
        $subjects = [1, 2, 3, 4]; // there are 4 data in the subject table by default
        $teachers = [1, 2, 3, 4]; // there are 4 data in the teacher table by default
        $rooms = [1, 2, 3, 4];
        $durations = [1, 1.5];
        $days = [0, 1, 2, 3, 4, 5, 6];

        $start_time = $this->faker->time($format = 'H:i:s', $max = '17:00:00'); // end time will not exceed 6 PM
        $duration = $this->faker->randomElement($durations);
        $end_time = Carbon::createFromFormat('H:i:s', $start_time)
            ->addMinutes($duration * 60)
            ->format('H:i:s');

        return [
            'subject_id' => $this->faker->randomElement($subjects),
            'teacher_id' => $this->faker->randomElement($teachers),
            'room_id' => $this->faker->randomElement($rooms),
            'duration' => $duration,
            'day' => $this->faker->randomElement($days),
            'start_time' => $start_time,
            'end_time' => $end_time,
        ];
    }
}
