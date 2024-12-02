<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
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
      'id' => $this->id,
      'name' => $this->name,
      'gender' => $this->gender,
      'birth_date' => $this->birth_date,
      'age' => $this->age,
      'nationality' => $this->nationality,
      'address' => $this->address,
      'postal_code' => $this->postal_code,
      'registration_date' => \Carbon\Carbon::parse($this->registration_date)->format('d-m-Y'),

      // Parent relationship
      'parents' => ParentsResource::collection($this->parents),

      // Lesson relationship
      'enrollments' => EnrollmentResource::collection($this->enrollments),
    ];
  }
}
