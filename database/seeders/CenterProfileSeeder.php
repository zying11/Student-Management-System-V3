<?php

namespace Database\Seeders;

use App\Models\CenterProfile;
use Illuminate\Database\Seeder;

class CenterProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CenterProfile::create([
            'center_name' => 'SAM Singapore Maths',
            'center_logo' => '',
            'favicon' => '',
            'address' => '39, Jalan Pelapik B U8/B, Bukit Jelutong, 40150',
            'postcode' => '40150',
            'city' => 'Shah Alam',
            'state' => 'Selangor',
        ]);
    }
}
