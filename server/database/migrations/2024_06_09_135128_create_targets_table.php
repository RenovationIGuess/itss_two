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
        Schema::create('targets', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->string('title');
            $table->string('due')->nullable();
            $table->string('description')->nullable();
            $table->integer('exp')->default(10);

            $table->uuid('team_id');
            $table->foreign('team_id')->references('id')->on('teams')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('targets');
    }
};
