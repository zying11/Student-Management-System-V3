<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStudentRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'gender' => 'required|string|in:male,female',
            'birth_date' => 'required|date',
            'age' => 'required|integer|min:0',
            'nationality' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'postal_code' => 'required|numeric',
        ];
    }
}
