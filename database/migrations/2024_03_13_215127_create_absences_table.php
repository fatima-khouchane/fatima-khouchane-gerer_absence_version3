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
       Schema::create('absences', function (Blueprint $table) {
        $table->id();
        $table->string('status');
        $table->integer('nombre_absence_heure');
        $table->date('date_absence');
        $table->unsignedBigInteger('id_stagiaire');
        $table->unsignedBigInteger('id_groupe');
        $table->unsignedBigInteger('id_filiere');
        $table->timestamps();

        $table->foreign('id_stagiaire')->references('id')->on('stagiaires');
        $table->foreign('id_groupe')->references('id')->on('groupes');
        $table->foreign('id_filiere')->references('id')->on('filieres');
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absences');
    }
};
