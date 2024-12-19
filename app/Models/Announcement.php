<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $fillable = ['admin_id', 'message'];

    public function recipients()
    {
        return $this->hasMany(Recipient::class);
    }
}

