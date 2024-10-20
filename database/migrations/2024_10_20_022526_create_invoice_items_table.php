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
        Schema::create('invoice_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invoice_id')->constrained()->onDelete('cascade'); 
            $table->string('item_name');        
            $table->integer('quantity');   
            $table->decimal('price', 10, 2); 
            $table->decimal('discount', 10, 2)->default(0); 
            $table->decimal('total', 10, 2); 
            $table->boolean('isManual')->default(false); // Flag to indicate if this item is manually added
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_items');
    }
};
