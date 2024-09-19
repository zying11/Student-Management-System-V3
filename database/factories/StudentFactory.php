<?php

namespace Database\Factories;

use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

class StudentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Student::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name,
            'gender' => $this->faker->randomElement(['male', 'female']),
            'birth_date' => $this->faker->date('Y-m-d', '2005-12-31'),
            'age' => $this->faker->numberBetween(5, 18),
            'nationality' => $this->faker->country,
            'address' => $this->faker->address,
            'postal_code' => $this->faker->postcode,
            'registration_date' => $this->faker->dateTimeBetween('-5 years', 'now'),
        ];
    }
}
