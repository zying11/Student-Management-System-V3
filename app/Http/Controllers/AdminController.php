<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Http\Resources\AdminResource;
use App\Http\Requests\StoreAdminRequest;
use App\Http\Requests\UpdateAdminRequest;
use Carbon\Carbon;

class AdminController extends Controller
{
    /**
     * Display a listing of the admins.
     */
    public function index()
    {
        // Retrieve all admins with their associated user details, ensuring only those with the admin role
        $admins = Admin::whereHas('user', function ($query) {
            $query->where('role_id', 1); // Only fetch users with role_id 1 (Admin)
        })
            ->with('user') // Eager load user relations
            ->orderBy('id', 'desc')
            ->get();

        // Return a collection of admins as a resource
        return AdminResource::collection($admins);
    }

    /**
     * Store a newly created admin in storage.
     */
    public function store(StoreAdminRequest $request)
    {
        // Validate the incoming request using store admin request class
        $validatedData = $request->validated();

        // Parse the birth_date from the validated data and calculate the age
        $birthDate = Carbon::parse($validatedData['birth_date']);
        $age = $birthDate->age;

        // Add the calculated age to the validated data
        $validatedData['age'] = $age;

        // Create a new admin record using the validated data
        $admin = Admin::create($validatedData);

        return new AdminResource($admin);
        // return response()->json(['admin' => $admin], 201);
    }

    /**
     * Display the specified admin.
     */
    public function show($id)
    {
        // Find the admin by ID
        $admin = Admin::findOrFail($id);

        // return response()->json($admin);
        return new AdminResource($admin);
    }

    /**
     * Update the specified admin in storage.
     */
    public function update(UpdateAdminRequest $request, $id)
    {
        // Find the admin by ID
        $admin = Admin::findOrFail($id);

        // Validate the incoming request using update admin request class
        $validatedData = $request->validated();

        // Parse the birth_date from the validated data and calculate the age
        $birthDate = Carbon::parse($validatedData['birth_date']);
        $validatedData['age'] = $birthDate->age;

        // Update the admin record with the validated data
        $admin->update($validatedData);

        return new AdminResource($admin);
        // return response()->json(['admin' => $admin], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Find the admin by ID
        $admin = Admin::findOrFail($id);

        // Delete the associated user
        $admin->user()->delete();

        // Delete the admin details
        $admin->delete();

        return response('', 204);
    }
}
