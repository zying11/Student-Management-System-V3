<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    protected $table = 'teachers';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id', // Foreign key to the users table
        'phone_number',
        'gender',
        'age',
        'birth_date',
        'nationality',
        'address',
        'postal_code',
        'admission_date'
    ];

    /**
     * Define the relationship to the User model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        // An admin belongs to a user
        return $this->belongsTo(User::class);
    }

    /**
     * Define the relationship to the Subject model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function subject()
    {
        // A teacher belongs to many subjects
        return $this->belongsToMany(Subject::class, 'teacher_subject');
    }
}
