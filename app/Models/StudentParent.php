<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentParent extends Model
{
    use HasFactory;
    protected $table = 'student_parent';

    protected $fillable = [
        'student_id',
        'parent_id',
    ];
}
