<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource
{
    public static $wrap = false;

    
    public function toArray(Request $request): array
    {
      return [
        'id' => $this->id,
        'name' => $this->name,
        'subject1Fee' => $this->subject1_fee,
        'subject2Fee' => $this->subject2_fee,
        'totalPayable' => $this->total_payable,
        'totalPaid' => $this->total_paid,
        'balance' => $this->balance,
        'created_at' => $this->created_at,
        'updated_at' => $this->updated_at,
    ];
    }
}

