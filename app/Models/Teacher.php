<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Teacher extends Model
{
    use HasFactory;

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
     * Define the relationship to the Lesson model.
     * one-to-many relationship with lessons
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function lesson()
    {
        // 
        // return $this->belongsTo(Lesson::class);
        return $this->hasMany(Lesson::class, 'teacher_id');
    }
}
