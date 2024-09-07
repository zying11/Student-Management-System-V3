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

    /**
     * Define the relationship to the Teacher model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function teacher()
    {
        // A subject belongs many teachers
        return $this->belongsToMany(Teacher::class, 'teacher_subject');
    }
}
