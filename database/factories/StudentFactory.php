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
            'birth_date' => $this->faker->date,
            'age' => $this->faker->numberBetween(18, 25),
            'nationality' => 'Malaysia',
            'address' => $this->faker->address,
            'postal_code' => $this->faker->postcode,
        ];
    }
}
