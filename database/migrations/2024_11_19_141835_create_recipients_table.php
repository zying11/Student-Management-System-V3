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
        Schema::create('recipients', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->unsignedBigInteger('announcement_id');
            $table->unsignedBigInteger('lesson_id');
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('announcement_id')->references('id')->on('announcements')->onDelete('cascade');
            $table->foreign('lesson_id')->references('id')->on('lessons')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recipients');
    }
};
