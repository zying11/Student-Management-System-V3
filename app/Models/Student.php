<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    // use HasFactory;

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

    // /**
    //  * Define the relationship to the Enrollment model.
    //  *
    //  * @return \Illuminate\Database\Eloquent\Relations\HasMany
    //  */
    // public function enrollments()
    // {
    //     return $this->hasMany(Enrollment::class);
    // }

    /**
     * Define the relationship to the Parent model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function parent()
    {
        return $this->belongsToMany(Parents::class, 'student_parent', 'student_id', 'parent_id');
    }

    /**
     * Define the relationship to the Lesson model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function lesson()
    {
        return $this->belongsToMany(Lesson::class, 'student_enrollment');
    }
}
