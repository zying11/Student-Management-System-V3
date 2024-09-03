<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Student;
use Faker\Factory as Faker;

class StudentDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Student::factory(5)->create();
        $faker = Faker::create();

        for ($i = 0; $i < 10; $i++) {
            Student::create([
                'name' => $faker->name,
                'gender' => $faker->randomElement(['male', 'female']),
                'birth_date' => $faker->date('Y-m-d', '2005-12-31'),
                'age' => $faker->numberBetween(5, 18),
                'nationality' => $faker->country,
                'address' => $faker->address,
                'postal_code' => $faker->postcode,
                'registration_date' => $faker->dateTimeBetween('-5 years', 'now'),
            ]);
        }
    }
    
}
