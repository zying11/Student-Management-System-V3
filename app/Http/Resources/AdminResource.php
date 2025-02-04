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
            // Join the user login details with the admin details and display
            'id' => $this->id,
            'user_id' => $this->user->id,
            'name' => $this->user->name,
            'email' => $this->user->email,
            'joining_date' => $this->user->created_at->format('d-m-Y'),
            'phone_number' => $this->phone_number,
            'gender' => $this->gender,
            'age' => $this->age,
            'birth_date' => $this->birth_date,
            'nationality' => $this->nationality,
            'address' => $this->address,
            'postal_code' => $this->postal_code,

            // Display all the user data
            'login_details' => $user = new UserResource($this->user),
        ];
    }
}

