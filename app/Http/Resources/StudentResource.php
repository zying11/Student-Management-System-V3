<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    public static $wrap = false;

    
    public function toArray($request)
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
        'study_level' => $this->study_level,
        'subject' => $this->subject,
        'registration_date' => $this->registration_date
  
    ];
    }
}
