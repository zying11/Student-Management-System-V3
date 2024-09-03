<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreParentsRequest;
use App\Http\Requests\UpdateParentsRequest;
use App\Http\Resources\ParentsResource;
use App\Models\Parents;
use Illuminate\Http\Request;

class ParentController extends Controller
{
    /**
     * Display a listing of the parents.
     */
    public function index()
    {
        // Retrieve all parents
        $parents = Parents::query()->orderBy('id', 'desc')->get();

        return ParentsResource::collection($parents);
    }

    /**
     * Store a newly created parent in storage.
     */
    public function store(StoreParentsRequest $request)
    {
        // Validate the incoming request using store parent request class
        $validatedData = $request->validated();

        // Create a new parent record using the validated data
        $parent = Parents::create($validatedData);

        return new ParentsResource($parent);
    }

    /**
     * Display the specified parent.
     */
    public function show($id)
    {
        // Find the parent by ID
        $parent = Parents::findOrFail($id);

        return new ParentsResource($parent);
    }

    /**
     * Update the specified parent in storage.
     */
    public function update(UpdateParentsRequest $request, $id)
    {
        // Find the parent by ID
        $parent = Parents::findOrFail($id);

        // Validate the incoming request using update parent request class
        $validatedData = $request->validated();

        // Update the parent record with the validated data
        $parent->update($validatedData);

        return new ParentsResource($parent);
    }

    /**
     * Remove the specified parent from storage.
     */
    public function destroy($id)
    {
        // Find the parent by ID
        $parent = Parents::findOrFail($id);

        // Delete the parent details
        $parent->delete();

        return response('', 204);
    }
}
