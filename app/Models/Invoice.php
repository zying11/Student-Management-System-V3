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
        'subject1_fee',
        'subject2_fee',
        'total_payable',
        'total_paid',
        'balance',
    ];


}
