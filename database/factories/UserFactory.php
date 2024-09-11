<?php

// namespace Database\Factories;

// use Illuminate\Database\Eloquent\Factories\Factory;
// use Illuminate\Support\Facades\Hash;
// use Illuminate\Support\Str;

// /**
//  * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
//  */
// class UserFactory extends Factory
// {
//     /**
//      * The current password being used by the factory.
//      */
//     protected static ?string $password;

//     /**
//      * Define the model's default state.
//      *
//      * @return array<string, mixed>
//      */
//     public function definition(): array
//     {
//         return [
//             'name' => fake()->name(),
//             'email' => fake()->unique()->safeEmail(),
//             'email_verified_at' => now(),
//             'password' => static::$password ??= Hash::make('password'),
//             'remember_token' => Str::random(10),
//         ];
//     }

//     /**
//      * Indicate that the model's email address should be unverified.
//      */
//     public function unverified(): static
//     {
//         return $this->state(fn (array $attributes) => [
//             'email_verified_at' => null,
//         ]);
//     }
// }

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
     /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

     /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'password' => bcrypt('password'), // Encrypt the password
            'role_id' => 1, // Default to admin role
        ];
    }

     /**
     * User is an admin.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function admin()
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => 'Admin ' . $this->faker->firstName,
                'role_id' => 1, // 1 is the admin role ID
            ];
        });
    }

    /**
     * User is a teacher.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function teacher()
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => 'Teacher ' . $this->faker->firstName,
                'role_id' => 2, // 2 is the teacher role ID
            ];
        });
    }
}
