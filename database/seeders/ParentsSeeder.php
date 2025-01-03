<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Parents;
use Faker\Factory as Faker;

class ParentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // // Generate 10 parent records using the ParentsFactory
        // Parents::factory()->count(15)->create();

        Parents::create([
            'id' => 1,
            'name' => "Regina Tang",
            'relationship' => "Mother",
            'email' => "reginatang306@gmail.com",
            'phone_number' => "01110603023"

        ]);

        Parents::create([
            'id' => 2,
            'name' => "Ham Zhi Ying",
            'relationship' => "Mother",
            'email' => "yingying22226@gmail.com",
            'phone_number' => "0126326885"

        ]);

        Parents::create([
            'id' => 3,
            'name' => "David Tan",
            'relationship' => "Father",
            'email' => "davidtan4521@example.com",
            'phone_number' => "01123456789"
        ]);
        
        Parents::create([
            'id' => 4,
            'name' => "Siti Hawa",
            'relationship' => "Mother",
            'email' => "siti.hawa456@example.com",
            'phone_number' => "0123456789"
        ]);
        
        Parents::create([
            'id' => 5,
            'name' => "Ahmad Shamsul",
            'relationship' => "Father",
            'email' => "ahmad.shamsul123@example.com",
            'phone_number' => "0198765432"
        ]);
        
        Parents::create([
            'id' => 6,
            'name' => "Nurul Aini",
            'relationship' => "Mother",
            'email' => "nurul.aini234@example.com",
            'phone_number' => "0144325678"
        ]);
        
        Parents::create([
            'id' => 7,
            'name' => "James Tan",
            'relationship' => "Father",
            'email' => "james.tan4567@example.com",
            'phone_number' => "01122334455"
        ]);
        
        Parents::create([
            'id' => 8,
            'name' => "Maya Rashid",
            'relationship' => "Mother",
            'email' => "maya.rashid6789@example.com",
            'phone_number' => "0134567890"
        ]);
        
        Parents::create([
            'id' => 9,
            'name' => "Liang Wei",
            'relationship' => "Father",
            'email' => "liangwei98@example.com",
            'phone_number' => "0167890123"
        ]);
        
        Parents::create([
            'id' => 10,
            'name' => "Rina Zainal",
            'relationship' => "Mother",
            'email' => "rina.zainal876@example.com",
            'phone_number' => "0122345678"
        ]);
        
        Parents::create([
            'id' => 11,
            'name' => "Mohd Ali",
            'relationship' => "Father",
            'email' => "mohd.ali7890@example.com",
            'phone_number' => "0175432109"
        ]);
        
        Parents::create([
            'id' => 12,
            'name' => "Maria Wong",
            'relationship' => "Mother",
            'email' => "maria.wong987@example.com",
            'phone_number' => "0189076543"
        ]);
        
        Parents::create([
            'id' => 13,
            'name' => "Samantha Lee",
            'relationship' => "Mother",
            'email' => "samantha.lee2023@example.com",
            'phone_number' => "01155667788"
        ]);
        
        Parents::create([
            'id' => 14,
            'name' => "John Lim",
            'relationship' => "Father",
            'email' => "john.lim512@example.com",
            'phone_number' => "0163456789"
        ]);
        
        Parents::create([
            'id' => 15,
            'name' => "Zarina Hassan",
            'relationship' => "Mother",
            'email' => "zarina.hassan341@example.com",
            'phone_number' => "0198712345"
        ]);
        
        Parents::create([
            'id' => 16,
            'name' => "Azman Rahman",
            'relationship' => "Father",
            'email' => "azman.rahman222@example.com",
            'phone_number' => "0129876543"
        ]);
        
        Parents::create([
            'id' => 17,
            'name' => "Fatin Syazwani",
            'relationship' => "Mother",
            'email' => "fatin.syazwani11@example.com",
            'phone_number' => "0181234567"
        ]);
        
        Parents::create([
            'id' => 18,
            'name' => "Kumar Pillai",
            'relationship' => "Father",
            'email' => "kumar.pillai55@example.com",
            'phone_number' => "0136543210"
        ]);
        
        Parents::create([
            'id' => 19,
            'name' => "Lina Ahmad",
            'relationship' => "Mother",
            'email' => "lina.ahmad654@example.com",
            'phone_number' => "0128765432"
        ]);

        Parents::create([
            'id' => 20,
            'name' => "Nana Aziz",
            'relationship' => "Mother",
            'email' => "nanaaziz@example.com",
            'phone_number' => "0134569780"
        ]);
    }
}