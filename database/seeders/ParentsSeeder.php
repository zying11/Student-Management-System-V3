<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Parents;
use Faker\Factory as Faker;

class ParentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Generate 10 parent records using the ParentsFactory
        Parents::factory()->count(15)->create();
    }
}