<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStudentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true; // Adjust the authorization logic based on your requirements
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'sometimes|string|max:255',
            'gender' => 'sometimes|string|in:male,female',
            'birth_date' => 'sometimes|date',
            'age' => 'sometimes|integer|min:0',
            'nationality' => 'sometimes|string|max:255',
            'address' => 'sometimes|string|max:255',
            'postal_code' => 'sometimes|numeric',
            'study_level' => 'sometimes|string|max:255', 
            'subject' => 'sometimes|string|max:255',
            'registration_date' => 'sometimes|date',
        ];
    }
}