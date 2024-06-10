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
        $durations = [1, 1.5];
        $days = [0, 1, 2, 3, 4, 5, 6];

        $start_time = $this->faker->time($format = 'H:i:s', $max = '17:00:00'); // end time will not exceed 6 PM
        $duration = $this->faker->randomElement($durations);
        $end_time = Carbon::createFromFormat('H:i:s', $start_time)
            ->addMinutes($duration * 60)
            ->format('H:i:s');

        return [
            'duration' => $duration,
            'day' => $this->faker->randomElement($days),
            'capacity' => $this->faker->numberBetween(1, 10),
            'start_time' => $start_time,
            'end_time' => $end_time,
        ];
    }
}
