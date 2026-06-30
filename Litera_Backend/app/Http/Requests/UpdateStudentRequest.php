<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStudentRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'name'    => 'sometimes|required|string|max:255',
            'nisn'    => [
                'sometimes',
                'required',
                'string',
                'max:20',
                Rule::unique('users')->ignore($this->route('student'))->where(function ($query) {
                    return $query->where('school_id', auth()->user()->school_id);
                }),
            ],
            'kelas'   => 'sometimes|required|string|max:50',
            'jurusan' => 'sometimes|required|string|max:100',
            'foto'    => 'sometimes|image|mimes:jpeg,png,jpg|max:2048',
        ];
    }

    /**
     * Custom error messages.
     */
    public function messages(): array
    {
        return [
            'nisn.unique' => 'NISN sudah terdaftar untuk sekolah ini.',
            'foto.max'    => 'Ukuran foto maksimal 2MB.',
        ];
    }
}
