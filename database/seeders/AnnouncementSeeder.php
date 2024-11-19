<?php

namespace Database\Seeders;

use App\Models\Announcement;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Announcement::create([
            'admin_id' => 1,
            'message' => "Tuition center will be closed on Christmas Day.",
        ]);

        Announcement::create([
            'admin_id' => 1,
            'message' => "Replacement class for all Wednesday class due to Christday Day will be announce soon.",
        ]);
    }
}
