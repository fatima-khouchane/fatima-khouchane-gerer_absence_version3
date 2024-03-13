<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login']]);
    }

    /* Login API */
   public function login(Request $request)
{
    $validator = Validator::make($request->all(), [
        'email' => 'required|string|email',
        'password' => 'required|string'
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 422);
    }

    $credentials = $request->only('email', 'password');

    if (!Auth::attempt($credentials)) {
        return response()->json([
            'status' => 'error',
            'message' => 'Unauthorized'
        ], 401);
    }

    // L'utilisateur est authentifié, récupérez-le de la base de données
    $user = Auth::user();

    // Vérifiez le rôle de l'utilisateur
    if ($user->role !== 'Directeur' && $user->role !== 'Surveillance') {
        return response()->json([
            'status' => 'error',
            'message' => 'You do not have the necessary role to log in.'
        ], 403);
    }

    // Générer le token JWT
    $token = Auth::attempt($credentials);

    return response()->json([
        'status' => 'success',
        'user' => $user,
        'authorisation' => [
            'token' => $token,
            'type' => 'bearer'
        ]
    ]);
}




    public function userDetails()
    {
        return response()->json(auth()->user());
    }

     public function logout(){
        auth()->logout();
        return response()->json(['message'=>'success déconnexion']);
     }
}