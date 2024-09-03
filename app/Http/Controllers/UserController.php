<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index()
    {
        // Retrieve all users with their associated role
        return UserResource::collection(
            User::with('role')->orderBy('id', 'desc')->get()
        );
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(StoreUserRequest $request)
    {
        // Validate and retrieve the request data
        $data = $request->validated();

        // Encrypt the password before storing
        $data['password'] = Hash::make($data['password']);

        // Create a new user record with the validated data
        $user = User::create($data);

        return new UserResource($user);
    }

    /**
     * Display the specified user.
     */
    public function show($id)
    {
        // Find the user by ID with the associated role
        $user = User::with('role')->findOrFail($id);

        return new UserResource($user);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(UpdateUserRequest $request, $id)
    {
        // Find the user by ID
        $user = User::findOrFail($id);

        // Validate and retrieve the request data
        $data = $request->validated();

        // Encrypt the password if provided in the update request
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        // Update the user record with the validated data
        $user->update($data);

        return new UserResource($user);
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        // Delete the specified user record
        $user->delete();

        return response('', 204);
    }
}