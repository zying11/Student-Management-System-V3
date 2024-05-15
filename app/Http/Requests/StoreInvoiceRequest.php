<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInvoiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true; // You may adjust the authorization logic based on your requirements
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules():array
    {
        return [
            'name' => 'required|exists:students,name', // Validate that the selected name exists in the 'name' column of the 'students' table
            'subject1Fee' => 'required|numeric',
            'subject2Fee' => 'required|numeric',
            // Add any other validation rules as needed
        ];
    }
}
