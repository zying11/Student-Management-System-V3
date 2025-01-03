<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Invoice;
use App\Models\RecordPayment;

class PaymentSeeder extends Seeder
{
    public function run()
    {
        // Define invoice variables
        $invoice1 = Invoice::find(1);
        $invoice2 = Invoice::find(2);
        $invoice3 = Invoice::find(3);
        $invoice4 = Invoice::find(4);

        // Record payment for Invoice 1
        RecordPayment::create([
            'receipt_number' => 'RCPT-' . date('Ymd', strtotime('2024-10-20')) . '-001',
            'invoice_id' => $invoice1->id,
            'amount' => $invoice1->total_payable,
            'payment_date' => '2024-10-20', 
            'payment_status' => 'paid', 
            'payment_method' => $invoice1->payment_method,
            'add_notes' => 'Payment completed for October 2024 semester',
        ]);

        // Record payment for Invoice 2
        RecordPayment::create([
            'receipt_number' => 'RCPT-' . date('Ymd', strtotime('2024-11-22')) . '-002',
            'invoice_id' => $invoice2->id,
            'amount' => $invoice2->total_payable,
            'payment_date' => '2024-11-22', 
            'payment_status' => 'paid',
            'payment_method' => $invoice2->payment_method,
            'add_notes' => 'Payment completed for November 2024 semester',
        ]);

        // Record payment for Invoice 3
        RecordPayment::create([
            'receipt_number' => 'RCPT-' . date('Ymd', strtotime('2024-12-23')) . '-003',
            'invoice_id' => $invoice3->id,
            'amount' => $invoice3->total_payable,
            'payment_date' => '2024-12-23',
            'payment_status' => 'paid', 
            'payment_method' => $invoice3->payment_method,
            'add_notes' => 'Payment completed for December 2024 semester',
        ]);

        // Record payment for Invoice 4
        RecordPayment::create([
            'receipt_number' => 'RCPT-' . date('Ymd', strtotime('2025-01-26')) . '-004',
            'invoice_id' => $invoice4->id,
            'amount' => $invoice4->total_payable,
            'payment_date' => '2025-01-26', 
            'payment_status' => 'paid', 
            'payment_method' => $invoice4->payment_method,
            'add_notes' => 'Payment completed for January 2025 semester',
        ]);
    }
}