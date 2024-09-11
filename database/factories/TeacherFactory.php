<?php

namespace Database\Factories;

use App\Models\Teacher;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TeacherFactory extends Factory
{
     /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Teacher::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'user_id' => null,  // This will be set later in the seeder
            'phone_number' => $this->faker->numerify('012#######'),
            'gender' => $this->faker->randomElement(['male', 'female']),
            'age' => $this->faker->numberBetween(25, 60),
            'birth_date' => $this->faker->date(),
            'nationality' => 'Malaysian',
            'address' => $this->faker->address,
            'postal_code' => $this->faker->postcode,
            'admission_date' => $this->faker->date(),
        ];
    }
}
