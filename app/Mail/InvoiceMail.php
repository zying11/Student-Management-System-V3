<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class InvoiceMail extends Mailable
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

        return $this->subject('Your Tuition Invoice from ' . $this->centerName)
            ->html("
                <p>Dear Parent/Guardian,</p>
                <p>Thank you for choosing {$this->centerName} for your child’s educational journey. Please find your latest tuition invoice attached to this email.</p>
                <p>We kindly request you to review the details of the invoice and make the payment by the due date to ensure uninterrupted services for your child. If you have already settled the payment, please disregard this message.</p>
                <p>If you have any questions or need assistance, feel free to contact us at <a href='mailto:smsfyp2324@gmail.com'>smsfyp2324@gmail.com</a> or call us at +1-123-456-7890. We are here to help!</p>
                <p>Thank you for your continued trust and support.</p>
                <p>Best regards,</p>
                <p><strong>{$this->centerName}</strong></p>
                <p><small>If this email was not intended for you, please disregard it.</small></p>
            ")
            ->attach($this->absolutePath, [
                'as' => 'Invoice.pdf', // File name to display
                'mime' => 'application/pdf',
            ]);
    }
}
