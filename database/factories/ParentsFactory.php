<?php

namespace Database\Factories;

use App\Models\Parents;
use Illuminate\Database\Eloquent\Factories\Factory;

class ParentsFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Parents::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name,
            'relationship' => $this->faker->randomElement(['Father', 'Mother', 'Guardian']),
            'email' => $this->faker->unique()->safeEmail,
            'phone_number' => $this->faker->numerify('012#######'),
        ];
    }
}
