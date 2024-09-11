<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    use HasFactory;

    public function subject()
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }
    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function studyLevel()
    {
        return $this->belongsTo(StudyLevel::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }


    public function student()
    {
        return $this->belongsToMany(Student::class, 'student_enrollment');
    }

}




