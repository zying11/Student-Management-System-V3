<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource
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
      'invoice_number' => $this->invoice_number,
      'issue_date' => $this->issue_date,
      'due_date' => $this->due_date,
      'student_id' => $this->student_id,
      'student' => $this->student, // Include student details
      'items' => json_decode($this->items), // Decode JSON string into an array
      'payment_method' => $this->payment_method,
      'add_notes' => $this->add_notes,
      'total_payable' => $this->total_payable,
    ];
  }
}

