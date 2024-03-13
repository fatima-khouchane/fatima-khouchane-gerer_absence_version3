<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'directeur',
            'email' => 'directeur@example.com',
            'role'=>'Directeur',
            'password' => Hash::make('password'),
        ]);

        User::create([
            'name' => 'surveillance',
            'email' => 'surveillance@example.com',
            'role'=>'Surveillance',
            'password' => Hash::make('password'),
        ]);
    }
}
