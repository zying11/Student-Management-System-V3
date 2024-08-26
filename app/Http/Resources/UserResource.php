<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
        return[
            // Display the user login details
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'joining_date' => $this->created_at->format('d-m-Y'),

            // Join the role details with user login details and display
            'role_id' => $this->role->id,
            'role_name' => $this->role->name,

            // Display all the role data
            'role' => $this->role,
        ];
    }
}
