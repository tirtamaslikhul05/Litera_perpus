<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBookRequest extends FormRequest
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
            'nama_buku'       => 'sometimes|required|string|max:255',
            'isbn'            => [
                'sometimes',
                'required',
                'string',
                'max:20',
                Rule::unique('books')->ignore($this->route('book'))->where(function ($query) {
                    return $query->where('school_id', auth()->user()->school_id);
                }),
            ],
            'pdf'             => 'sometimes|boolean',
            'jumlah_buku'     => 'sometimes|required|integer|min:0',
            'jumlah_pinjam'   => 'sometimes|integer|min:0',
            'jumlah_tersedia' => 'sometimes|integer|min:0',
            'cover'           => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ];
    }

    /**
     * Custom error messages.
     */
    public function messages(): array
    {
        return [
            'isbn.unique' => 'ISBN sudah terdaftar untuk sekolah ini.',
            'cover.max'   => 'Ukuran cover maksimal 2MB.',
        ];
    }
}
