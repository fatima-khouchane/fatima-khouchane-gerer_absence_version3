<?php

namespace App\Http\Controllers;

use App\Models\Absence;
use Illuminate\Http\Request;
use App\Models\Groupe;
use App\Models\Filiere;
use App\Models\Stagiaire;
use Illuminate\Support\Facades\DB;

class SurveillanceController extends Controller
{
    public function getFiliere()
    {
        $filieres = Filiere::all();

        return response()->json($filieres);
    }

    public function getGroupe()
    {
        $groupes = Groupe::all();

        return response()->json($groupes);
    }
    public function  getStagiaireByFilter($filiere, $groupe){
         $stagiaires = Stagiaire::where('id_groupe', $filiere)
                            ->where('id_filiere', $groupe)
                            ->get();
         return response()->json($stagiaires);
    }

    public function saveAbsence(Request $request)
{
    $absencesData = $request->all();

    try {
        foreach ($absencesData as $absence) {
            if (!isset($absence['status'], $absence['nombre_absence_heure'], $absence['date_absence'], $absence['id_stagiaire'], $absence['id_groupe'], $absence['id_filiere'])) {
                return response()->json(['message' => 'Données d\'absence invalides'], 400);
            }

            Absence::create([
                'status' => $absence['status'],
                'nombre_absence_heure' => $absence['nombre_absence_heure'],
                'date_absence' => $absence['date_absence'],
                'id_stagiaire' => $absence['id_stagiaire'],
                'id_groupe' => $absence['id_groupe'],
                'id_filiere' => $absence['id_filiere'],
            ]);
        }

        return response()->json(['message' => 'Absences enregistrées avec succès'], 200);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Une erreur est survenue lors de l\'enregistrement des absences'], 500);
    }
}

public function checkAbsencesExistence($filiere, $groupe, $date)
{
    $absencesData = Absence::where('id_filiere', $filiere)
        ->where('id_groupe', $groupe)
        ->whereDate('date_absence', $date)
        ->get();

    if ($absencesData->isEmpty()) {
        return response()->json(['exist' => false, 'absences' => $absencesData]);
    } else {
        return response()->json(['exist' => true, 'absences' => $absencesData]);
    }
}

    public function updateAbsence(Request $request)
{
    $absencesData = $request->all();

    try {
        foreach ($absencesData as $absence) {
            if (!isset($absence['id'], $absence['status'], $absence['nombre_absence_heure'], $absence['date_absence'], $absence['id_stagiaire'], $absence['id_groupe'], $absence['id_filiere'])) {
                return response()->json(['message' => 'Données d\'absence invalides'], 400);
            }

            $absenceToUpdate = Absence::find($absence['id']);

            if (!$absenceToUpdate) {
                return response()->json(['message' => 'Absence introuvable'], 404);
            }

            $absenceToUpdate->status = $absence['status'];
            $absenceToUpdate->nombre_absence_heure = $absence['nombre_absence_heure'];
            $absenceToUpdate->date_absence = $absence['date_absence'];
            $absenceToUpdate->id_stagiaire = $absence['id_stagiaire'];
            $absenceToUpdate->id_groupe = $absence['id_groupe'];
            $absenceToUpdate->id_filiere = $absence['id_filiere'];
            $absenceToUpdate->save();
        }

        return response()->json(['message' => 'Absences mises à jour avec succès'], 200);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Une erreur est survenue lors de la mise à jour des absences'], 500);
    }
}




 public function getFiliereById($id)
    {
        $filiere = Filiere::find($id);

        if (!$filiere) {
            return response()->json(['error' => 'Filière non trouvée'], 404);
        }

        return response()->json($filiere);
    }

    public function getGroupeById($id)
    {
        $groupe = Groupe::find($id);

        if (!$groupe) {
            return response()->json(['error' => 'Groupe non trouvé'], 404);
        }

        return response()->json($groupe);
    }   



    // 

    
public function getStagiairesDashboard(Request $request)
{
    
    $promotion = $request->input('promotion');

    $stagiairesWithAbsencesAndSanctions = DB::table('stagiaires')
        ->join('absences', 'stagiaires.id', '=', 'absences.id_stagiaire')
        ->leftJoin('vue_sanctions', 'stagiaires.id', '=', 'vue_sanctions.id_stagiaire')
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
            DB::raw('SUM(absences.nombre_absence_heure) as total_absences'),
            'vue_sanctions.type_sanction'
        )
       
        ->where('stagiaires.promotion', '=', $promotion)
        ->groupBy(
            'stagiaires.id',
            'stagiaires.promotion',
            'stagiaires.nom',
            'stagiaires.prenom',
            'stagiaires.email',
            'stagiaires.telephone',
            'groupes.numero_groupe',
            'filieres.nom_filiere',
            'vue_sanctions.type_sanction'
        )
        ->get();

    return response()->json(['stagiaires' => $stagiairesWithAbsencesAndSanctions]);
}


// 

    public function generateReport(Request $request)
    {
        $stagiaireId = $request->input('id_stagiaire');
        $startDate = $request->input('date_debut');
        $endDate = $request->input('date_fin');

        if (!$stagiaireId || !$startDate || !$endDate) {
            return response()->json(['error' => 'Veuillez fournir tous les paramètres nécessaires.'], 400);
        }else{

       $absences = Absence::where('id_stagiaire', $stagiaireId)
                       ->whereBetween('date_absence', [$startDate, $endDate])
                       ->join('stagiaires', 'absences.id_stagiaire', '=', 'stagiaires.id')
                       ->join('groupes', 'absences.id_groupe', '=', 'groupes.id')
                       ->join('filieres', 'absences.id_filiere', '=', 'filieres.id')
                       ->select('stagiaires.nom', 'stagiaires.prenom', 'groupes.numero_groupe as groupe', 'filieres.nom_filiere as filiere', 'absences.status', 'absences.nombre_absence_heure','absences.date_absence','stagiaires.promotion')
                       ->get();

        return response()->json(['absences' => $absences], 200);}
    }


public function checkAbsencesExistenceSaisir($filiere, $groupe, $date)
{
    $absencesData = Absence::where('id_filiere', $filiere)
        ->where('id_groupe', $groupe)
        ->whereDate('date_absence', $date)
        ->get();

    if ($absencesData->isEmpty()) {
        return response()->json(['message' => 'Absence pas encore saisir.']);
    }
        return response()->json(['message' => 'Absence deja saisir.']);}




        public function dashboard_statistique(Request $request)
{
    $promotion = $request->input('promotion');

    $totalStagiaires = DB::table('stagiaires')
        ->where('promotion', $promotion)
        ->count();

    if ($totalStagiaires === 0) {
        return response()->json([
            'error' => 'Aucun stagiaire trouvé pour l\'année scolaire spécifiée.'
        ], 404);
    }

   
    $totalFilieres = DB::table('stagiaires')
        ->join('filieres', 'stagiaires.id_filiere', '=', 'filieres.id')
        ->where('stagiaires.promotion', $promotion)
        ->select('filieres.id')
        ->distinct()
        ->count();

    $totalExclusions = DB::table('stagiaires')
        ->join('vue_sanctions', 'stagiaires.id', '=', 'vue_sanctions.id_stagiaire')
        ->where('stagiaires.promotion', $promotion)
        ->where('vue_sanctions.type_sanction', 'exclusion définitive')
        ->count();

    return response()->json([
        'totalStagiaires' => $totalStagiaires,
        'totalFilieres' => $totalFilieres,
        'totalExclusions' => $totalExclusions
    ]);
}


}
