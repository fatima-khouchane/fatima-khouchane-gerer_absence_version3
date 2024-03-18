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

        return response()->json(['exist' => $absencesData->isNotEmpty(), 'absences' => $absencesData]);
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

}
