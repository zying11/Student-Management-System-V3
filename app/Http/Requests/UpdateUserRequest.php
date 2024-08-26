<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            // 'email' => 'required|email|unique:users,email,'.$this->id,
            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email,' . $this->id,
            ],
            'password' => [
                'nullable',
                Password::min(8)
                ->letters()
                // Password::min(8)->letters()->numbers()->mixedCase()->symbols(),
            ],
            'role_id' => 'sometimes|exists:roles,id', 
        ];
    }
}
