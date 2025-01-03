<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Student;
use Faker\Factory as Faker;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // // Generate 10 students using the StudentFactory
        // Student::factory()->count(10)->create();

        Student::create([
            'id' => 1,
            'name' => 'John Doe',
            'gender' => 'male',
            'birth_date' => '2015-12-31',
            'age' => 10,
            'nationality' => 'Malaysian',
            'address' => '123, Jalan ABC',
            'postal_code' => '67880',
            'registration_date' => '2025-01-01',
            'created_at' => '2025-01-01',
        ]);

        Student::create([
            'id' => 2,
            'name' => 'Jane Smith',
            'gender' => 'female',
            'birth_date' => '2014-07-15',
            'age' => 11,
            'nationality' => 'Malaysian',
            'address' => '456, Jalan XYZ',
            'postal_code' => '67890',
            'registration_date' => '2021-02-10',
            'created_at' => '2021-02-10',
        ]);

        Student::create([
            'id' => 3,
            'name' => 'Amirul Zulkifli',
            'gender' => 'male',
            'birth_date' => '2013-05-21',
            'age' => 12,
            'nationality' => 'Malaysian',
            'address' => '789, Jalan ABC',
            'postal_code' => '54321',
            'registration_date' => '2022-03-15',
            'created_at' => '2022-03-15',
        ]);

        Student::create([
            'id' => 4,
            'name' => 'Aisyah Noor',
            'gender' => 'female',
            'birth_date' => '2012-09-10',
            'age' => 13,
            'nationality' => 'Malaysian',
            'address' => '101, Jalan DEF',
            'postal_code' => '11223',
            'registration_date' => '2023-04-20',
            'created_at' => '2023-04-20',
        ]);

        Student::create([
            'id' => 5,
            'name' => 'Mohammad Khairul',
            'gender' => 'male',
            'birth_date' => '2011-02-25',
            'age' => 14,
            'nationality' => 'Malaysian',
            'address' => '202, Jalan GHI',
            'postal_code' => '33445',
            'registration_date' => '2024-05-15',
            'created_at' => '2024-05-15',
        ]);

        Student::create([
            'id' => 6,
            'name' => 'Siti Fatimah',
            'gender' => 'female',
            'birth_date' => '2010-12-17',
            'age' => 15,
            'nationality' => 'Malaysian',
            'address' => '303, Jalan JKL',
            'postal_code' => '55667',
            'registration_date' => '2023-09-09',
            'created_at' => '2023-09-09',
        ]);

        Student::create([
            'id' => 7,
            'name' => 'Zainal Abidin',
            'gender' => 'male',
            'birth_date' => '2009-11-05',
            'age' => 16,
            'nationality' => 'Malaysian',
            'address' => '404, Jalan MNO',
            'postal_code' => '77889',
            'registration_date' => '2020-06-25',
            'created_at' => '2020-06-25',
        ]);

        Student::create([
            'id' => 8,
            'name' => 'Maya Sharifah',
            'gender' => 'female',
            'birth_date' => '2008-01-29',
            'age' => 17,
            'nationality' => 'Malaysian',
            'address' => '505, Jalan PQR',
            'postal_code' => '88990',
            'registration_date' => '2021-07-30',
            'created_at' => '2021-07-30',
        ]);

        Student::create([
            'id' => 9,
            'name' => 'Mohd Zaki',
            'gender' => 'male',
            'birth_date' => '2007-08-10',
            'age' => 18,
            'nationality' => 'Malaysian',
            'address' => '606, Jalan STU',
            'postal_code' => '99001',
            'registration_date' => '2022-08-12',
            'created_at' => '2022-08-12',
        ]);

        Student::create([
            'id' => 10,
            'name' => 'Rina Azizah',
            'gender' => 'female',
            'birth_date' => '2006-06-30',
            'age' => 19,
            'nationality' => 'Malaysian',
            'address' => '707, Jalan VWX',
            'postal_code' => '11234',
            'registration_date' => '2023-11-05',
            'created_at' => '2023-11-05',
        ]);

        Student::create([
            'id' => 11,
            'name' => 'Hassan Ali',
            'gender' => 'male',
            'birth_date' => '2005-03-22',
            'age' => 20,
            'nationality' => 'Malaysian',
            'address' => '808, Jalan YZA',
            'postal_code' => '22345',
            'registration_date' => '2021-10-01',
            'created_at' => '2021-10-01',
        ]);

        Student::create([
            'id' => 12,
            'name' => 'Farah Jamilah',
            'gender' => 'female',
            'birth_date' => '2014-03-04',
            'age' => 11,
            'nationality' => 'Malaysian',
            'address' => '909, Jalan DEF',
            'postal_code' => '33456',
            'registration_date' => '2022-09-15',
            'created_at' => '2022-09-15',
        ]);

        Student::create([
            'id' => 13,
            'name' => 'Ahmad Iman',
            'gender' => 'male',
            'birth_date' => '2013-01-18',
            'age' => 12,
            'nationality' => 'Malaysian',
            'address' => '1010, Jalan PQR',
            'postal_code' => '44567',
            'registration_date' => '2024-02-01',
            'created_at' => '2024-02-01',
        ]);

        Student::create([
            'id' => 14,
            'name' => 'Lina Tan',
            'gender' => 'female',
            'birth_date' => '2012-10-14',
            'age' => 13,
            'nationality' => 'Malaysian',
            'address' => '1111, Jalan STU',
            'postal_code' => '55678',
            'registration_date' => '2023-05-25',
            'created_at' => '2023-05-25',
        ]);

        Student::create([
            'id' => 15,
            'name' => 'Jacky Chan',
            'gender' => 'male',
            'birth_date' => '2012-10-24',
            'age' => 13,
            'nationality' => 'Malaysian',
            'address' => 'abc Jalan STU',
            'postal_code' => '55678',
            'registration_date' => '2023-05-25',
            'created_at' => '2023-05-25',
        ]);
    }
}
