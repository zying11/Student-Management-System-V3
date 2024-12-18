<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudyLevel extends Model
{
    use HasFactory;

    protected $table = 'study_level';

    // zy - 
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }
}
