<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminResource extends JsonResource
{
    // Disable wrapping of the resource in a wrapper object
    public static $wrap = false;

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            // Display the admin's basic details
            'id' => $this->id,
            'phone_number' => $this->phone_number,
            'gender' => $this->gender,
            'age' => $this->age,
            'birth_date' => $this->birth_date,
            'nationality' => $this->nationality,
            'address' => $this->address,
            'postal_code' => $this->postal_code,

            // Join the user login details with the admin details and display
            'user_id' => $this->user->id,
            'name' => $this->user->name,
            'email' => $this->user->email,
            'joining_date' => $this->user->created_at->format('d-m-Y'),

            // Display all the user data
            'user' => new UserResource($this->whenLoaded('user')),
        ];
    }
}

