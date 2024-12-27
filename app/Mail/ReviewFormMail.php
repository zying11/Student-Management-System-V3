<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class ReviewFormMail extends Mailable
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

        return $this->subject('Your Student Assessment Feedback Review Form from ' . $this->centerName)
            ->html("
        <p>Dear Parent/Guardian,</p>
        <p>We hope this message finds you well. Please find attached your child's latest Student Assessment Feedback Review Form from {$this->centerName}.</p>
        <p>We encourage you to review the feedback and let us know if you have any questions or suggestions. Our goal is to continuously improve the learning experience for your child.</p>
        <p>If you have any queries, feel free to reach out to us at <a href=\"mailto:smsfyp2324@gmail.com\">smsfyp2324@gmail.com</a> or call +1-123-456-7890.</p>
        <p>Thank you for your continued support and partnership in your child's education.</p>
        <p>Best regards,</p>
        <p><strong>{$this->centerName}</strong></p>
        <p><small>If this email was not intended for you, please disregard it.</small></p>
    ")
            ->attach($this->absolutePath, [
                'as' => 'StudentAssessmentFeedback.pdf', // File name to display
                'mime' => 'application/pdf',
            ]);
    }
}