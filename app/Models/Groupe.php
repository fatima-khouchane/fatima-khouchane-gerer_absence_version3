<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Groupe extends Model
{
    use HasFactory;
        protected $fillable = ['nom_groupe'];

     public function stagiaires()
    {
        return $this->hasMany(Stagiaire::class, 'id_groupe');
    }
}
