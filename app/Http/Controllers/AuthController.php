<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();
        
        // Check if a user with the provided email exists
        $user = User::where('email', $credentials['email'])->first();

        if (!$user) {
            // No user found with the provided email
            return response()->json([
                'message' => 'Email is incorrect'
            ], 401);
        }

        // Attempt to authenticate the user with the provided password
        if (!Auth::attempt(['email' => $credentials['email'], 'password' => $credentials['password']])) {
            // Password is incorrect
            return response()->json([
                'message' => 'Password is incorrect'
            ], 401);
        }

        // Check if the user's role matches the role sent from the front end
        if ($user->role->name !== $credentials['role']) {
            return response()->json([
                'message' => 'Invalid role for this user.',
            ], 403);
        }

        // Authentication successful, retrieve user and generate token
        $authenticatedUser = Auth::user();
        $token = $authenticatedUser->createToken('main')->plainTextToken;

        return response()->json([
            'user' => $authenticatedUser,
            'token' => $token
        ]);
    }

    public function register(RegisterRequest $request)
    {
        $data = $request->validated();

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);

        $token = $user->createToken('main')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        $user->currentAccessToken()->delete();

        return response('',204);
    }
}
