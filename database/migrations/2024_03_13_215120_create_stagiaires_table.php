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
        Schema::create('stagiaires', function (Blueprint $table) {
        $table->id();
        $table->string('nom');
        $table->string('prenom');
        $table->string('telephone');
        $table->string('email');
        $table->unsignedBigInteger('id_groupe');
        $table->unsignedBigInteger('id_filiere');
        $table->string('promotion');
        $table->timestamps();

        $table->foreign('id_groupe')->references('id')->on('groupes');
        $table->foreign('id_filiere')->references('id')->on('filieres');
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stagiaires');
    }
};
