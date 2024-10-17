<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('subjects', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->unsignedBigInteger('level_id');
            $table->string('subject_name');
            $table->unsignedBigInteger('subject_fee');
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('level_id')->references('id')->on('study_level')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subjects');
    }
};
