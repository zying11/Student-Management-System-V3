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
        'totalPayable',
        'totalPaid',
        'balance',
    ];

    // Accessor method for calculating totalPayable
    public function getTotalPayableAttribute()
    {
        return $this->subject1Fee + $this->subject2Fee;
    }

    // Accessor method for calculating totalPaid (assuming it's not stored in the database)
    public function getTotalPaidAttribute()
    {
        
        return 0; // Return the actual calculation based on payments
    }

    // Accessor method for calculating balance
    public function getBalanceAttribute()
    {
        return $this->totalPayable - $this->totalPaid;
    }
}
