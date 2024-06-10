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
        Schema::create('target_tasks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('target_id');
            $table->uuid('user_id');

            $table->string('title');
            $table->string('description')->nullable();
            $table->string('due')->nullable();
            $table->integer('exp')->default(5);
            $table->boolean('completed')->default(false);

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('target_id')->references('id')->on('targets')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('target_tasks');
    }
};
