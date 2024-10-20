<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Invoice;
use App\Models\InvoiceItem;

class InvoiceSeeder extends Seeder
{
    public function run()
    {
        // Create multiple invoices with items
        Invoice::factory()
            ->count(10) // Create 10 invoices
            ->has(InvoiceItem::factory()->count(3), 'items') // Each invoice has 3 items
            ->create()
            ->each(function ($invoice) {
                // Calculate the total payable based on the items
                $totalPayable = $invoice->items->sum('total');
                $invoice->update(['total_payable' => $totalPayable]);
            });
    }
}