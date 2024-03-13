<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Filiere extends Model
{
    use HasFactory;
        protected $fillable = ['nom_filiere'];

     public function stagiaires()
    {
        return $this->hasMany(Stagiaire::class, 'id_filiere');
    }
    
}
