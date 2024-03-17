<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sanction extends Model
{
    use HasFactory;
     protected $fillable = ['id_stagiaire', 'type_sanction'];

    public function stagiaire()
    {
        return $this->belongsTo(Stagiaire::class, 'id_stagiaire');
    }
}
