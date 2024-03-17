<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       DB::statement("
            CREATE VIEW vue_sanctions AS
            SELECT
                s.id AS id_stagiaire,
                CASE
                    WHEN SUM(a.nombre_absence_heure) = 5 THEN 'Première mise en garde'
                    WHEN SUM(a.nombre_absence_heure) = 10 THEN 'Deuxième mise en garde'
                    WHEN SUM(a.nombre_absence_heure) = 15 THEN 'Premier avertissement'
                    WHEN SUM(a.nombre_absence_heure) = 20 THEN 'Deuxième avertissement'
                    WHEN SUM(a.nombre_absence_heure) = 25 THEN 'Blâme'
                    WHEN SUM(a.nombre_absence_heure) = 30 THEN 'Exclusion de 2 jours'
                   WHEN SUM(a.nombre_absence_heure) = 35 THEN 'Exclusion temporaire'
                   WHEN SUM(a.nombre_absence_heure) = 40 THEN 'Exclusion temporaire'
                   WHEN SUM(a.nombre_absence_heure) = 45 THEN 'Exclusion temporaire'

                    WHEN SUM(a.nombre_absence_heure) > 50 THEN 'Exclusion définitive'
                    ELSE 'Pas de sanction'
                END AS type_sanction
            FROM
                stagiaires s
            LEFT JOIN
                absences a ON s.id = a.id_stagiaire
            GROUP BY
                s.id;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vue_sanctions_view');
    }
};
