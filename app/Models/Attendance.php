<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $table = 'attendance';
    protected $fillable = [
        'lesson_id',
        'student_id',
        'attendance_status',
        'attendance_date',
    ];

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }


    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function lesson()
    {
        return $this->belongsTo(Lesson::class, 'lesson_id');
    }

}
