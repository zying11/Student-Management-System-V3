<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class InvoiceMail extends Mailable
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

        return $this->subject('Your Invoice')
            ->html('<p>Dear Customer,</p><p>Please find your invoice attached.</p>')
            ->attach($this->absolutePath, [
                'as' => 'Invoice.pdf', // File name to display
                'mime' => 'application/pdf',
            ]);
    }
}