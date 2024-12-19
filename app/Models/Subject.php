<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    public function studyLevel()
    {
        return $this->belongsTo(StudyLevel::class, 'level_id');
    }

    // zy- Define the relationship to Feedback
    public function feedback()
    {
        return $this->hasMany(Feedback::class);
    }
}
