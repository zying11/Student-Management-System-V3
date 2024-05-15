<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    
    protected $table = 'students';
    protected $fillable = ['name', 'gender', 'birth_date', 'age', 'nationality', 'address', 'postal_code','study_level','subject','registration_date'];
}
