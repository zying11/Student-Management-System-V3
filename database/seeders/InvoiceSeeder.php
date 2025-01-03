<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Invoice;
use App\Models\InvoiceItem;

class InvoiceSeeder extends Seeder
{
    public function run()
    {
        // // Create multiple invoices with items
        // Invoice::factory()
        //     ->count(10) // Create 10 invoices
        //     ->has(InvoiceItem::factory()->count(3), 'items') // Each invoice has 3 items
        //     ->create()
        //     ->each(function ($invoice) {
        //         // Calculate the total payable based on the items
        //         $totalPayable = $invoice->items->sum('total');
        //         $invoice->update(['total_payable' => $totalPayable]);
        //     });

        // Invoice for Student 1
        $invoice1 = Invoice::create([
            'invoice_number' => 'INV-' . date('Ymd', strtotime('2024-10-15')) . '-001', // Invoice number format
            'issue_date' => '2024-10-15',
            'due_date' => '2024-11-15',
            'student_id' => 1,
            'payment_method' => 'Credit Card',
            'add_notes' => 'Payment for October semester',
            'total_payable' => 200.00
        ]);

        InvoiceItem::create([
            'invoice_id' => $invoice1->id,
            'item_name' => 'Tuition Fee',
            'quantity' => 1,
            'price' => 150.00,
            'discount' => 0.00,
            'total' => 150.00,
            'isManual' => false
        ]);

        InvoiceItem::create([
            'invoice_id' => $invoice1->id,
            'item_name' => 'Lab Fee',
            'quantity' => 1,
            'price' => 50.00,
            'discount' => 0.00,
            'total' => 50.00,
            'isManual' => false
        ]);

        // Invoice for Student 2
        $invoice2 = Invoice::create([
            'invoice_number' => 'INV-' . date('Ymd', strtotime('2024-11-16')) . '-002', // Invoice number format
            'issue_date' => '2024-11-16',
            'due_date' => '2024-12-16',
            'student_id' => 2,
            'payment_method' => 'Bank Transfer',
            'add_notes' => 'Payment for November semester',
            'total_payable' => 250.00
        ]);

        InvoiceItem::create([
            'invoice_id' => $invoice2->id,
            'item_name' => 'Tuition Fee',
            'quantity' => 1,
            'price' => 200.00,
            'discount' => 0.00,
            'total' => 200.00,
            'isManual' => false
        ]);

        InvoiceItem::create([
            'invoice_id' => $invoice2->id,
            'item_name' => 'Library Fee',
            'quantity' => 1,
            'price' => 50.00,
            'discount' => 0.00,
            'total' => 50.00,
            'isManual' => false
        ]);

        // Invoice for Student 3
        $invoice3 = Invoice::create([
            'invoice_number' => 'INV-' . date('Ymd', strtotime('2024-12-17')) . '-003', // Invoice number format
            'issue_date' => '2024-12-17',
            'due_date' => '2025-01-17',
            'student_id' => 3,
            'payment_method' => 'Cash',
            'add_notes' => 'Payment for December semester',
            'total_payable' => 300.00
        ]);

        InvoiceItem::create([
            'invoice_id' => $invoice3->id,
            'item_name' => 'Tuition Fee',
            'quantity' => 1,
            'price' => 250.00,
            'discount' => 0.00,
            'total' => 250.00,
            'isManual' => false
        ]);

        InvoiceItem::create([
            'invoice_id' => $invoice3->id,
            'item_name' => 'Activity Fee',
            'quantity' => 1,
            'price' => 50.00,
            'discount' => 0.00,
            'total' => 50.00,
            'isManual' => false
        ]);

        // Invoice for Student 4
        $invoice4 = Invoice::create([
            'invoice_number' => 'INV-' . date('Ymd', strtotime('2025-01-18')) . '-004', // Invoice number format
            'issue_date' => '2025-01-18',
            'due_date' => '2025-02-18',
            'student_id' => 4,
            'payment_method' => 'Debit Card',
            'add_notes' => 'Payment for January semester',
            'total_payable' => 180.00
        ]);

        InvoiceItem::create([
            'invoice_id' => $invoice4->id,
            'item_name' => 'Tuition Fee',
            'quantity' => 1,
            'price' => 130.00,
            'discount' => 0.00,
            'total' => 130.00,
            'isManual' => false
        ]);

        InvoiceItem::create([
            'invoice_id' => $invoice4->id,
            'item_name' => 'Insurance Fee',
            'quantity' => 1,
            'price' => 50.00,
            'discount' => 0.00,
            'total' => 50.00,
            'isManual' => false
        ]);
    }
}