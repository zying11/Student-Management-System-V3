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
            'subject_name' => 'English',
            'subject_fee' => 50
        ]);

        Subject::create([
            'level_id' => 2,
            'subject_name' => 'Mathematics',
            'subject_fee' => 60
        ]);

        Subject::create([
            'level_id' => 3,
            'subject_name' => 'Science',
            'subject_fee' => 65
        ]);

        Subject::create([
            'level_id' => 4,
            'subject_name' => 'Chemistry',
            'subject_fee' => 70
        ]);
    }
}
