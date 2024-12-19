<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipient extends Model
{
    use HasFactory;

    protected $fillable = ['announcement_id', 'lesson_id'];

    public function announcement()
    {
        return $this->belongsTo(Announcement::class);
    }
}
