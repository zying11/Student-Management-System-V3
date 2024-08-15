<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         // Ensure the admin role exists
         $adminRole = Role::firstOrCreate(['name' => 'admin']);
        
         // Ensure the teacher role exists
         $teacherRole = Role::firstOrCreate(['name' => 'teacher']);
 
         // Create a user and assign the admin role
         $user1 = User::create([
             'name' => 'Test User',
             'email' => 'test@example.com',
             'password' => bcrypt('Test1234'), // Encrypt the password here
             'role_id' => $adminRole->id, // Assign the admin role ID
         ]);
 
         // Create another user and assign the teacher role
         $user2 = User::create([
             'name' => 'zhiying',
             'email' => 'yingying22226@gmail.com',
             'password' => bcrypt('zhiying1234'), // Encrypt the password here
             'role_id' => $teacherRole->id, // Assign the teacher role ID
         ]);
     }
}
