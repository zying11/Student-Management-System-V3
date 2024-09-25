<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeacherResource extends JsonResource
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
            // Display the teacher's basic details
            // Join the user login details with the teacher details and display
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

            // Teacher's subject teaching details, grouped by lesson
            'subject_teaching' => $this->lesson->map(function ($lesson) {
                return [
                    'lesson_id' => $lesson->id,
                    'day' => $lesson->day,
                    'subject_name' => $lesson->subject->subject_name ?? null,
                    'study_level_name' => $lesson->subject->studyLevel->level_name ?? null,
                    'room_name' => $lesson->room->room_name ?? null,
                    'start_time' => $lesson->start_time,
                    'end_time' => $lesson->end_time,
                ];
            }),

            // Display all the user data
            'login_details' => $user = new UserResource($this->user),
        ];
    }
}

