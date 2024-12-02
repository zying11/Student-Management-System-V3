<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecordPaymentResource extends JsonResource
{
  // Disable wrapping of the resource in a wrapper object
  public static $wrap = false;

  /**
   * Transform the resource into an array.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    return [
      'id' => $this->id,
      'receipt_number' => $this->receipt_number,
      'invoice_id' => $this->invoice_id,
      'amount' => $this->amount,
      'payment_date' => $this->payment_date,
      'payment_status' => $this->payment_status,
      'payment_method' => $this->payment_method,
      'add_notes' => $this->add_notes,
      'invoice' => $this->invoice ? new InvoiceResource($this->invoice) : null,
    ];
  }
}

