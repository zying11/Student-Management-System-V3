<?php

namespace Database\Factories;

use App\Models\Admin;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Admin>
 */
class AdminFactory extends Factory
{
    protected $model = Admin::class;

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
            'admission_date' => $this->faker->date('Y-m-d', '2021-01-01'),
        ];
    }
}
