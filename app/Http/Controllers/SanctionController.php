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


public function getStagiairesWithAbsencesAndSanctions(Request $request)
{
    $id_filiere = $request->input('id_filiere');
    $id_groupe = $request->input('id_groupe');
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
        ->where('filieres.id', '=', $id_filiere)
        ->where('groupes.id', '=', $id_groupe)
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




// public function getStagiairesWithAbsencesAndSanctions(Request $request)
// {
//     $nom_filiere = $request->input('nom_filiere');
//     $numero_groupe = $request->input('numero_groupe');
//     $promotion = $request->input('promotion');

//     $stagiairesWithAbsencesAndSanctions = DB::table('stagiaires')
//         ->join('absences', 'stagiaires.id', '=', 'absences.id_stagiaire')
//         ->leftJoin('vue_sanctions', 'stagiaires.id', '=', 'vue_sanctions.id_stagiaire')
//         ->join('groupes', 'stagiaires.id_groupe', '=', 'groupes.id')
//         ->join('filieres', 'stagiaires.id_filiere', '=', 'filieres.id')
//         ->select(
//            'stagiaires.id',
//             'stagiaires.promotion',
//             'stagiaires.nom',
//             'stagiaires.prenom',
//             'stagiaires.email',
//             'stagiaires.telephone',
//             'groupes.numero_groupe as numero_groupe',
//             'filieres.nom_filiere as nom_filiere',
//             DB::raw('SUM(absences.nombre_absence_heure) as total_absences'),
//             'vue_sanctions.type_sanction'
//         )
//         ->where('filieres.nom_filiere', '=', $nom_filiere)
//         ->where('groupes.numero_groupe', '=', $numero_groupe)
//         ->where('stagiaires.promotion', '=', $promotion)
//         ->groupBy(
//             'stagiaires.id',
//             'stagiaires.promotion',
//             'stagiaires.nom',
//             'stagiaires.prenom',
//             'stagiaires.email',
//             'stagiaires.telephone',
//             'groupes.numero_groupe',
//             'filieres.nom_filiere',
//             'vue_sanctions.type_sanction'
//         )
//         ->get();

//     return response()->json(['stagiaires' => $stagiairesWithAbsencesAndSanctions]);
// }

}
