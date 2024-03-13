<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stagiaire extends Model
{
    use HasFactory;
        protected $fillable = ['nom', 'prenom', 'telephone', 'email','cin', 'id_groupe', 'id_filiere', 'promotion'];

     public function filiere()
    {
        return $this->belongsTo(Filiere::class, 'id_filiere');
    }

    public function groupe()
    {
        return $this->belongsTo(Groupe::class, 'id_groupe');
    }

    public function absences()
    {
        return $this->hasMany(Absence::class, 'id_stagiaire');
    }
}
