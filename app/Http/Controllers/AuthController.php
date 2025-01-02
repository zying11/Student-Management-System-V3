<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    /**
     * Handle the login request.
     */
    public function login(LoginRequest $request)
    {
        // Validate the incoming request data using login request class
        $credentials = $request->validated();

        // Check if a user with the provided email exists
        $user = User::where('email', $credentials['email'])->first();

        if (!$user) {
            // No user found with the provided email
            return response()->json([
                'message' => 'Email is incorrect'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Attempt to authenticate the user with the provided email and password
        if (!Auth::attempt(['email' => $credentials['email'], 'password' => $credentials['password']])) {
            // Password is incorrect
            return response()->json([
                'message' => 'Password is incorrect'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Check if the user's role matches the role sent from the front end
        if ($user->role->name !== $credentials['role']) {
            // Role does not match
            return response()->json([
                'message' => 'Invalid role for this user.',
            ], Response::HTTP_FORBIDDEN);
        }

        // Authentication successful, retrieve authenticated user and generate access token
        $authenticatedUser = Auth::user();
        $token = $authenticatedUser->createToken('main')->plainTextToken;

        // Return the authenticated user and token
        return response()->json([
            'user' => $authenticatedUser,
            'token' => $token,
            'teacher_name' => $authenticatedUser->name  // Include teacher's name
        ]);
    }

    public function showLoginForm()
    {
        return view('auth.login'); // renders the login form view for web-based apps
    }

    /**
     * Handle the logout request.
     */
    public function logout(Request $request)
    {
        // Retrieve the currently authenticated user
        $user = $request->user();

        // Revoke the current access token
        $user->currentAccessToken()->delete();

        return response('', 204);
    }
}
