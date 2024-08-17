<?php

namespace Database\Seeders;

use App\Models\StudyLevel;
use Illuminate\Database\Seeder;

class StudyLevelSeeder extends Seeder
{
    public function run(): void
    {
        StudyLevel::create([
            'level_name' => 'Lower Primary'
        ]);

        StudyLevel::create([
            'level_name' => 'Upper Primary'
        ]);

        StudyLevel::create([
            'level_name' => 'Lower Secondary'
        ]);

        StudyLevel::create([
            'level_name' => 'Upper Secondary'
        ]);
    }
}
