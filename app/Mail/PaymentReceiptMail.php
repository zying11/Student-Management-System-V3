<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class PaymentReceiptMail extends Mailable
{
    protected $absolutePath;

    public function __construct($absolutePath)
    {
        $this->absolutePath = $absolutePath;
    }

    // Build the email
    public function build()
    {
        // Check if the file exists before attaching it
        if (!file_exists($this->absolutePath)) {
            throw new \Exception("File not found: {$this->absolutePath}");
        }

        return $this->subject('Your Payment Receipt')
            ->html('<p>Dear Customer,</p><p>Please find your payment receipt attached.</p>')
            ->attach($this->absolutePath, [
                'as' => 'PaymentReceipt.pdf', // File name to display
                'mime' => 'application/pdf',
            ]);
    }
}
