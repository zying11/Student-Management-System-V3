<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class PaymentReceiptMail extends Mailable
{
    protected $absolutePath;
    protected $centerName;
    protected $centerLogo;
    protected $centerAddress;
    protected $centerCity;

    public function __construct($absolutePath, $centerData)
    {
        $this->absolutePath = $absolutePath;
        $this->centerName = $centerData['center_name'];
        $this->centerLogo = $centerData['center_logo'];
        $this->centerAddress = $centerData['address'];
        $this->centerCity = $centerData['city'];
    }

    // Build the email
    public function build()
    {
        // Check if the file exists before attaching it
        if (!file_exists($this->absolutePath)) {
            throw new \Exception("File not found: {$this->absolutePath}");
        }

        return $this->subject('Your Payment Receipt from ' . $this->centerName)
            ->html("
        <p>Dear Parent/Guardian,</p>
        <p>Thank you for your recent payment to {$this->centerName}. Please find your payment receipt attached to this email for your records.</p>
        <p>If you have any questions or need further clarification regarding this payment, please feel free to contact us at <a href=\"mailto:smsfyp2324@gmail.com\">smsfyp2324@gmail.com</a> or call +1-123-456-7890.</p>
        <p>We appreciate your prompt payment and continued support for your child's education.</p>
    
        <p>Best regards,</p>
        <p><strong>{$this->centerName}</strong></p>
        <p><small>If this email was not intended for you, please disregard it.</small></p>
    ")
            ->attach($this->absolutePath, [
                'as' => 'PaymentReceipt.pdf', // File name to display
                'mime' => 'application/pdf',
            ]);
    }
}
