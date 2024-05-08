<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
          User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => ('Test1234'), // Set the password here
        ]);
    }
}
