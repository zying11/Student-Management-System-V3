<?php

namespace Database\Seeders;

use App\Models\Room;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Room::create([
            'room_name' => 'Front Room',
            'capacity' => 5,
        ]);

        Room::create([
            'room_name' => 'Big Room',
            'capacity' => 15,
        ]);

        Room::create([
            'room_name' => 'Small Room',
            'capacity' => 3,
        ]);


    }
}
