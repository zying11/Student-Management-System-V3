<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Parents;
use Faker\Factory as Faker;

class ParentsTableSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        for ($i = 0; $i < 10; $i++) {
            Parents::create([
                'name' => $faker->name,
                'relationship' => $faker->randomElement(['Father', 'Mother', 'Guardian']),
                'email' => $faker->unique()->safeEmail,
                'phone_number' => $faker->phoneNumber,
            ]);
        }
    }
}
