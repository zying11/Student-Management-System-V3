<?php

namespace Database\Seeders;

use App\Models\Recipient;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RecipientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Recipient::create([
            'announcement_id' => 1,
            'lesson_id' => 1,
        ]);
        Recipient::create([
            'announcement_id' => 1,
            'lesson_id' => 2,
        ]);
        Recipient::create([
            'announcement_id' => 1,
            'lesson_id' => 3,
        ]);
        Recipient::create([
            'announcement_id' => 1,
            'lesson_id' => 4,
        ]);
        Recipient::create([
            'announcement_id' => 2,
            'lesson_id' => 3,
        ]);
        Recipient::create([
            'announcement_id' => 2,
            'lesson_id' => 4,
        ]);
    }
}
