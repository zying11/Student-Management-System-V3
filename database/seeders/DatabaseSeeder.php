<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        //     'password' => ('Test1234'), // Set the password here
        // ]);
        $this->call([
            UserSeeder::class,
            StudentDataSeeder::class,
            CenterProfileSeeder::class,
            // LessonSeeder::class,
        ]);
    }
}
