<?php

namespace App\Http\Controllers;

use App\Models\Absence;
use Illuminate\Http\Request;
use App\Models\Groupe;
use App\Models\Filiere;
use App\Models\Stagiaire;

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
            // Validation des données
            if (!isset($absence['status'], $absence['nombre_absence_heure'], $absence['date_absence'], $absence['id_stagiaire'], $absence['id_groupe'], $absence['id_filiere'])) {
                return response()->json(['message' => 'Données d\'absence invalides'], 400);
            }

            // Création de l'enregistrement d'absence
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
        // Gestion des erreurs
        return response()->json(['message' => 'Une erreur est survenue lors de l\'enregistrement des absences'], 500);
    }
}

public function checkAbsencesExistence($filiere, $groupe, $date)
    {
        $absencesExist = Absence::where('id_filiere', $filiere)
            ->where('id_groupe', $groupe)
            ->whereDate('date_absence', $date)
            ->exists();

        return response()->json(['exist' => $absencesExist]);
    }

    

}
