<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Admin;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Fetch all users with the admin role
        $adminUsers = User::where('role_id', 1)->get();

        // Loop through each user and create an admin record using the factory
        foreach ($adminUsers as $user) {
            Admin::factory()->create([
                'user_id' => $user->id,
            ]);
        }
    }
}
