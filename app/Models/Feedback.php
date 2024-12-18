<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;
    protected $casts = [
        'topics' => 'array',
    ];

    protected $fillable = [
        'teacher_id',
        'student_id',
        'subject_id',
        'month',
        'status',
        'review_date',
        'topics',
        'overall_feedback',
        'suggestions',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }
}
