<?php

namespace App\Http\Controllers;

use App\Models\Absence;
use App\Models\Sanction;
use App\Models\Stagiaire;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SanctionController extends Controller
{
        
// use App\Models\Sanction;





        // public function getStagiairesWithAbsencesAndSanctions()
        //     {
        //         $stagiaires = DB::table('view_stagiaires_with_absences_and_sanctions')->get();

        //         return response()->json(['stagiaires' => $stagiaires]);
        //     }
    
   public function showSanction()
    {
       $sanctions = DB::table('vue_sanctions')->get();

        return response()->json(['sanctions' => $sanctions]);
    }



   public function getStagiairesWithAbsencesAndSanctions()
{
    $stagiairesWithAbsencesAndSanctions = DB::table('stagiaires')
        ->join('absences', 'stagiaires.id', '=', 'absences.id_stagiaire')
        ->leftJoin('vue_sanctions', 'stagiaires.id', '=', 'vue_sanctions.id_stagiaire')
        ->join('groupes', 'stagiaires.id_groupe', '=', 'groupes.id') // Jointure avec la table des groupes
        ->join('filieres', 'stagiaires.id_filiere', '=', 'filieres.id') // Jointure avec la table des filières
        ->select(
            'stagiaires.nom',
            'stagiaires.prenom',
            'stagiaires.email',
            'stagiaires.telephone',
            'groupes.numero_groupe as numero_groupe', // Sélectionnez le nom du groupe à partir de la jointure
            'filieres.nom_filiere as nom_filiere', // Sélectionnez le nom de la filière à partir de la jointure
            DB::raw('SUM(absences.nombre_absence_heure) as total_absences'),
            'vue_sanctions.type_sanction'
        )
        ->groupBy(
            'stagiaires.id',
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

}
