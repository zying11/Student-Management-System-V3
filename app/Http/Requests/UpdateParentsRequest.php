<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateParentsRequest extends FormRequest
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
    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'relationship' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                'unique:parents,email,' . $this->id,
            ],
            // 'email' => [
            //     'nullable',
            //     'email',
            //     'max:255',
            //     Rule::unique('parents')->ignore($this->route('parent')),
            // ],
            'phone_number' => 'required|digits_between:10,15',
        ];
    }
}