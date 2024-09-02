<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeacherSubjectResource extends JsonResource
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
            'subject_id' => $this->id,
            'subject_name' => $this->subject_name,
            'teacher_id' => $this->pivot->teacher_id,
        ];
    }
}
