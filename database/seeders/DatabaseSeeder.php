<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Appel du seeder pour la table des utilisateurs
        $this->call(UsersTableSeeder::class);

        // Autres seeders...
    }
}
