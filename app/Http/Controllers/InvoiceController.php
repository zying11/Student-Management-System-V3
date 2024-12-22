<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\InvoiceResource;
use App\Models\Invoice;
use Illuminate\Support\Facades\Mail;
use App\Mail\InvoiceMail;
use Carbon\Carbon;

class InvoiceController extends Controller
{
    /**
     * Generate a new invoice number.
     */
    public function generateInvoiceNumber()
    {
        // Get the last invoice record and extract the last number
        $lastInvoice = Invoice::orderBy('created_at', 'desc')->first();
        $lastNumber = $lastInvoice ? intval(substr($lastInvoice->invoice_number, -3)) : 0;

        // Generate a new invoice number based on the current date
        $newInvoiceNumber = 'INV-' . date('Ymd') . '-' . str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);

        return response()->json(['invoice_number' => $newInvoiceNumber]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Retrieve all invoices, along with the associated student data
        $invoices = Invoice::with('student')->orderBy('id', 'desc')->get();

        return InvoiceResource::collection($invoices);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the request data
        $request->validate([
            'invoice_number' => 'required|unique:invoices',
            'issue_date' => 'required|date',
            'due_date' => 'required|date',
            'student_id' => 'required|exists:students,id',
            'payment_method' => 'nullable|string',
            'add_notes' => 'nullable|string',
            'total_payable' => 'required|numeric',
            'items' => 'required|array',
            'items.*.item_name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
            'items.*.discount' => 'nullable|numeric',
            'items.*.total' => 'required|numeric',
            'items.*.isManual' => 'required|boolean',
        ]);

        // Create the invoice
        $invoice = Invoice::create($request->only(['invoice_number', 'issue_date', 'due_date', 'student_id', 'payment_method', 'add_notes', 'total_payable']));

        // Create invoice items
        foreach ($request->items as $item) {
            $invoice->items()->create($item);
        }

        return response()->json(['message' => 'Invoice created successfully', 'invoice' => $invoice,], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // Retrieve the invoice with the associated student and items
        $invoice = Invoice::with('student')->findOrFail($id);

        return new InvoiceResource($invoice);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Validate the request data
        $request->validate([
            'invoice_number' => 'required|unique:invoices,invoice_number,' . $id,
            'issue_date' => 'required|date',
            'due_date' => 'required|date',
            'student_id' => 'required|exists:students,id',
            'payment_method' => 'nullable|string',
            'add_notes' => 'nullable|string',
            'total_payable' => 'required|numeric',
            'items' => 'required|array',
            'items.*.item_name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
            'items.*.discount' => 'nullable|numeric',
            'items.*.total' => 'required|numeric',
            'items.*.isManual' => 'required|boolean',
        ]);

        // Find the invoice
        $invoice = Invoice::findOrFail($id);

        // Update the invoice details
        $invoice->update($request->only(['invoice_number', 'issue_date', 'due_date', 'student_id', 'payment_method', 'add_notes', 'total_payable']));

        // Clear existing items and add new items
        $invoice->items()->delete();
        foreach ($request->items as $item) {
            $invoice->items()->create($item);
        }

        return response()->json(['message' => 'Invoice updated successfully', 'invoice' => $invoice], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Find the invoice by ID
        $invoice = Invoice::findOrFail($id);

        // Delete the invoice details
        $invoice->delete();

        return response('', 204);
    }

    /**
     * Send invoice as PDF attachments via email.
     */
    public function sendInvoicePdfEmail(Request $request)
    {
        $request->validate([
            'emails' => 'required|array',
            'emails.*' => 'email', // Validate each email
            'pdf' => 'required|file|mimes:pdf|max:2048',
        ]);

        // Save the uploaded PDF temporarily
        $pdfPath = $request->file('pdf')->store('invoices');

        $absolutePath = storage_path("app/{$pdfPath}");

        foreach ($request->emails as $email) {
            Mail::to($email)->send(new InvoiceMail($absolutePath));
        }

        return response()->json(['message' => 'Invoice sent successfully.']);
    }

    // Filter invoices by date
    public function filterInvoices(Request $request)
    {
        try {
            // Default to 'this_month'
            $dateFilter = $request->query('date_filter', 'this_month'); 

            // Define the start date based on the selected filter
            switch ($dateFilter) {
                case 'last_3_months':
                    $startDate = Carbon::now()->subMonths(3)->startOfMonth();
                    break;

                case 'this_month':
                default:
                    $startDate = Carbon::now()->startOfMonth();
                    break;
            }

            // Get invoices filtered by the date and eager load the associated student data
            $invoices = Invoice::with('student')
                ->where('issue_date', '>=', $startDate)
                ->orderBy('id', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'invoices' => InvoiceResource::collection($invoices) 
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching invoices: ' . $e->getMessage()
            ], 500);
        }
    }
}
