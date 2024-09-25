<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Teacher;

class TeacherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Fetch all users with the teacher role
        $teacherUsers = User::where('role_id', 2)->get();

        // Loop through each user and create a teacher record using the factory
        foreach ($teacherUsers as $user) {
            // Create a teacher record
            Teacher::factory()->create([
                'user_id' => $user->id, // Assign the user_id from the User model
            ]);
        }
    }
}
