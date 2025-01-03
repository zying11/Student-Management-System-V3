<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            AdminSeeder::class,
            StudentSeeder::class,
            ParentsSeeder::class,
            StudentParentSeeder::class,
            CenterProfileSeeder::class,
            StudyLevelSeeder::class,
            SubjectSeeder::class,
            RoomSeeder::class,
            TeacherSeeder::class,
            LessonSeeder::class,
            EnrollmentSeeder::class,
            InvoiceSeeder::class,
            AnnouncementSeeder::class,
            RecipientSeeder::class,
            PaymentSeeder::class,
        ]);
    }
}
