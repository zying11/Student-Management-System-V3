<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    public function run(): void
    {
        Subject::create([
            'level_id' => 1,
            'subject_name' => 'English'
        ]);

        Subject::create([
            'level_id' => 2,
            'subject_name' => 'Mathematics'
        ]);

        Subject::create([
            'level_id' => 3,
            'subject_name' => 'Science'
        ]);

        Subject::create([
            'level_id' => 4,
            'subject_name' => 'Chemistry'
        ]);
    }
}
