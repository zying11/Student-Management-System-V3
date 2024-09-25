<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop the teacher_subject table
        Schema::dropIfExists('teacher_subject');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Recreate the teacher_subject table with the previous structure
        Schema::create('teacher_subject', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('teacher_id'); // Foreign key for teachers table
            $table->unsignedBigInteger('subject_id'); // Foreign key for subjects table
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('teacher_id')->references('id')->on('teachers')->onDelete('cascade');
            $table->foreign('subject_id')->references('id')->on('subjects')->onDelete('cascade');
        });
    }
};
