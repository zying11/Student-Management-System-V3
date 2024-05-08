<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $table = 'invoices';

    protected $fillable = [
        'name',
        'subject1Fee',
        'subject2Fee',
        'total_payable',
        'total_paid',
        'balance',
    ];


}
