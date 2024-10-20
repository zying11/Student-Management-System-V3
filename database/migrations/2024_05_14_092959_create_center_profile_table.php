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
        Schema::create('center_profile', function (Blueprint $table) {
            $table->id();
            $table->string('center_name');
            $table->string('center_logo')->nullable();
            $table->string('favicon')->nullable();
            $table->string('address');
            $table->string('postcode');
            $table->string('city');
            $table->string('state');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('center_profile');
    }
};
