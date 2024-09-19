<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Student extends Model
{
    use HasFactory;

    protected $table = 'students';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'gender',
        'birth_date',
        'age',
        'nationality',
        'address',
        'postal_code',
        'study_level',
        'subject',
        'registration_date'
    ];

    /**
     * Define the relationship to the Parent model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function parents()
    {
        return $this->belongsToMany(Parents::class, 'student_parent', 'student_id', 'parent_id');
    }

    /**
     * Define the relationship to the Enrollment model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'student_id');
    }

    /**
     * Format the date of student registration.
     * @param mixed $value
     * @return string
     */
    public function getRegistrationDateAttribute($value)
    {
        return \Carbon\Carbon::parse($value)->format('d-m-Y');
    }
}