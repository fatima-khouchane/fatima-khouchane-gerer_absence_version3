<?php

namespace App\Http\Controllers;

use App\Models\Absence;
use App\Models\Sanction;
use App\Models\Stagiaire;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SanctionController extends Controller
{
public function   getStagiairesWithAbsencesAndSanctions(Request $request)
{
    $id_filiere = $request->input('id_filiere');
    $id_groupe = $request->input('id_groupe');
    $promotion = $request->input('promotion');

    $query = DB::table('stagiaires')
        ->join('absences', 'stagiaires.id', '=', 'absences.id_stagiaire')
        ->join('groupes', 'stagiaires.id_groupe', '=', 'groupes.id')
        ->join('filieres', 'stagiaires.id_filiere', '=', 'filieres.id')
        ->select(
            'stagiaires.id',
            'stagiaires.promotion',
            'stagiaires.nom',
            'stagiaires.prenom',
            'stagiaires.email',
            'stagiaires.telephone',
            'groupes.numero_groupe as numero_groupe',
            'filieres.nom_filiere as nom_filiere',
            DB::raw('SUM(CASE WHEN absences.status = "Absence" THEN absences.nombre_absence_heure ELSE 0 END) as total_absences_injustifié'),
// DB::raw('SUM(CASE WHEN absences.status = "Absence" THEN absences.nombre_absence_heure ELSE 0 END) as total_absence'),

            DB::raw('CASE 
                            WHEN SUM(CASE WHEN absences.status = "Absence" THEN absences.nombre_absence_heure ELSE 0 END) = 5 THEN "1ére Mise en garde"
                            WHEN SUM(CASE WHEN absences.status = "Absence" THEN absences.nombre_absence_heure ELSE 0 END) = 10 THEN "2 éme Mise en garde"
                            WHEN SUM(CASE WHEN absences.status = "Absence" THEN absences.nombre_absence_heure ELSE 0 END) = 15 THEN "1ére avertissement"                              
                            WHEN SUM(CASE WHEN absences.status = "Absence" THEN absences.nombre_absence_heure ELSE 0 END) = 20 THEN "Blame"
                            WHEN SUM(CASE WHEN absences.status = "Absence" THEN absences.nombre_absence_heure ELSE 0 END) = 30 THEN "Exclusion temporaire "
                            WHEN SUM(CASE WHEN absences.status = "Absence" THEN absences.nombre_absence_heure ELSE 0 END) = 35 THEN "Exclusion temporaire"
                            WHEN SUM(CASE WHEN absences.status = "Absence" THEN absences.nombre_absence_heure ELSE 0 END) = 40 THEN "Exclusion temporaire"
                            WHEN SUM(CASE WHEN absences.status = "Absence" THEN absences.nombre_absence_heure ELSE 0 END) >= 50 THEN "Exclusion définitive"
                            ELSE "Pas de sanction" 
                        END AS type_sanction')
        );

    if ($id_filiere && $id_groupe && $promotion) {
        $query->where('filieres.id', '=', $id_filiere)
            ->where('groupes.id', '=', $id_groupe)
            ->where('stagiaires.promotion', '=', $promotion);
    } elseif ($id_filiere && $id_groupe) {
        $query->where('filieres.id', '=', $id_filiere)
            ->where('groupes.id', '=', $id_groupe);
    } elseif ($promotion) {
        $query->where('stagiaires.promotion', '=', $promotion);
    } else {
        return response()->json(['error' => 'Veuillez fournir au moins la promotion, ou l\'identifiant du groupe et de la filière.']);
    }

    $stagiairesWithAbsencesAndSanctions = $query
        ->groupBy(
            'stagiaires.id',
            'stagiaires.promotion',
            'stagiaires.nom',
            'stagiaires.prenom',
            'stagiaires.email',
            'stagiaires.telephone',
            'groupes.numero_groupe',
            'filieres.nom_filiere'
        )
        ->get();

    if ($stagiairesWithAbsencesAndSanctions->isEmpty()) {
        return response()->json(['error' => 'Aucun stagiaire trouvé pour ces critères.']);
    }

    return response()->json(['stagiaires' => $stagiairesWithAbsencesAndSanctions]);
}
public function statistique(Request $request)
{
    $promotion = $request->input('promotion');

$totalFilieres = DB::table('stagiaires')
    ->where('promotion', '=', $promotion)
    ->join('filieres', 'stagiaires.id_filiere', '=', 'filieres.id')
    ->distinct()
    ->count('stagiaires.id_filiere');



    $totalStagiaires = DB::table('stagiaires')
        ->where('promotion', '=', $promotion)
        ->select('id_stagiaire')
        ->distinct()
        ->count();

    return response()->json([
        'totalStagiaires' => $totalStagiaires,
        'totalFilieres' => $totalFilieres,
    ]);
}

}
