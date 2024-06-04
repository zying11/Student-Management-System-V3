<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    use HasFactory;

    // protected $fillable = [
    //     'subject',
    //     'study_level',
    // ];
    protected $fillable = ['subject', 'study_level', 'class_time'];


    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
