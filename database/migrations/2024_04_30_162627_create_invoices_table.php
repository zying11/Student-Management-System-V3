<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInvoicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('invoices')) {
        Schema::create('invoices', function (Blueprint $table) {
            // $table->id();
            $table->bigIncrements('id');
            // $table->unsignedBigInteger('student_id');
            // $table->foreign('student_id')->references('id')->on('students');
            $table->string('name');
            $table->decimal('subject1Fee', 8, 2);
            $table->decimal('subject2Fee', 8, 2);
            $table->decimal('totalPayable', 8, 2);
            $table->decimal('totalPaid', 8, 2);
            $table->decimal('balance', 8, 2);
            $table->timestamps();
        });
    }
}

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('invoices');
    }
}
