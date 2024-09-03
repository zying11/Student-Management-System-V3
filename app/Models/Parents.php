<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Parents extends Model
{

    protected $table = 'parents';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone_number',
        'relationship'
    ];

    /**
     * Define the relationship to the Student model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function student()
    {
        return $this->belongsToMany(Student::class, 'student_parent', 'parent_id', 'student_id');
    }
}
