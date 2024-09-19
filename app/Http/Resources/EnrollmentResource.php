<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EnrollmentResource extends JsonResource
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

            // Include subject details if they exist
            'subject' => $this->subject ? [
                'id' => $this->subject->id,
                'subject_name' => $this->subject->subject_name,
            ] : null,

            // Include study level details if they exist
            'study_level' => $this->studyLevel ? [
                'id' => $this->studyLevel->id,
                'level_name' => $this->studyLevel->level_name,
            ] : null,

            // Include lesson details if they exist
            'lesson' => $this->lesson ? [
                'id' => $this->lesson->id,
                'subject_name' => $this->lesson->subject ? $this->lesson->subject->subject_name : 'N/A',
                'start_time' => $this->lesson->start_time,
                'end_time' => $this->lesson->end_time,
            ] : null,
        ];
    }
}