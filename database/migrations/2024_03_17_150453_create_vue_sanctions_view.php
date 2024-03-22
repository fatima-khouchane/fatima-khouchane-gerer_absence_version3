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
                    WHEN SUM(CASE WHEN a.status = 'Absence' THEN a.nombre_absence_heure ELSE 0 END) = 5 THEN 'Première mise en garde'
                    WHEN SUM(CASE WHEN a.status = 'Absence' THEN a.nombre_absence_heure ELSE 0 END) = 10 THEN 'Deuxième mise en garde'
                    WHEN SUM(CASE WHEN a.status = 'Absence' THEN a.nombre_absence_heure ELSE 0 END) = 15 THEN 'Premier avertissement'
                    WHEN SUM(CASE WHEN a.status = 'Absence' THEN a.nombre_absence_heure ELSE 0 END) = 20 THEN 'Deuxième avertissement'
                    WHEN SUM(CASE WHEN a.status = 'Absence' THEN a.nombre_absence_heure ELSE 0 END) = 25 THEN 'Blâme'
                    WHEN SUM(CASE WHEN a.status = 'Absence' THEN a.nombre_absence_heure ELSE 0 END) = 30 THEN 'Exclusion de 2 jours'
                    WHEN SUM(CASE WHEN a.status = 'Absence' THEN a.nombre_absence_heure ELSE 0 END) = 35 THEN 'Exclusion temporaire'
                    WHEN SUM(CASE WHEN a.status = 'Absence' THEN a.nombre_absence_heure ELSE 0 END) = 40 THEN 'Exclusion temporaire'
                    WHEN SUM(CASE WHEN a.status = 'Absence' THEN a.nombre_absence_heure ELSE 0 END) = 45 THEN 'Exclusion temporaire'
                    WHEN SUM(CASE WHEN a.status = 'Absence' THEN a.nombre_absence_heure ELSE 0 END) > 50 THEN 'Exclusion définitive'
                    ELSE 'Pas de sanction'
                END AS type_sanction
            FROM
                stagiaires s
            LEFT JOIN
                absences a ON s.id = a.id_stagiaire
            WHERE
                a.status = 'Absence'
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
