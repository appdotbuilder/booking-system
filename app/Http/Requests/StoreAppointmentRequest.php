<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAppointmentRequest extends FormRequest
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
            'agent_id' => 'required|exists:users,id',
            'service_id' => 'required|exists:services,id',
            'scheduled_at' => 'required|date|after:now',
            'notes' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'agent_id.required' => 'Please select an agent.',
            'agent_id.exists' => 'The selected agent is not available.',
            'service_id.required' => 'Please select a service.',
            'service_id.exists' => 'The selected service is not available.',
            'scheduled_at.required' => 'Please select an appointment time.',
            'scheduled_at.after' => 'Appointment time must be in the future.',
        ];
    }
}