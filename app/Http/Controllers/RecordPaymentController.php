<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\RecordPaymentResource;
use App\Models\RecordPayment;
use App\Models\CenterProfile;
use Illuminate\Support\Facades\Mail;
use App\Mail\PaymentReceiptMail;
use Carbon\Carbon;

class RecordPaymentController extends Controller
{
    /**
     * Generate a new receipt number.
     */
    public function generateReceiptNumber()
    {
        // Get the last receipt record and extract the last number
        $lastReceipt = RecordPayment::orderBy('created_at', 'desc')->first();
        $lastNumber = $lastReceipt ? intval(substr($lastReceipt->receipt_number, -3)) : 0;

        // Generate a new receipt number based on the current date
        $newReceiptNumber = 'RCPT-' . date('Ymd') . '-' . str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);

        return response()->json(['receipt_number' => $newReceiptNumber]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Retrieve all record payment
        $payments = RecordPayment::with('invoice')->orderBy('id', 'desc')->get();

        return RecordPaymentResource::collection($payments);
    }

    /**
     * Display the specified payment record
     */
    public function show($invoiceId)
    {
        $payment = RecordPayment::where('invoice_id', $invoiceId)->first();

        if (!$payment) {
            return response()->json([
                'message' => 'No payment found for the provided invoice ID.'
            ], 404);
        }

        return new RecordPaymentResource($payment);
    }

    // Store a new payment record
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'receipt_number' => 'required|string',
            'invoice_id' => 'required|exists:invoices,id',
            'amount' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'payment_status' => 'required|string',
            'payment_method' => 'required|string',
            'add_notes' => 'nullable|string'
        ]);

        $payment = RecordPayment::create($validatedData);

        return response()->json(['message' => 'Payment recorded successfully.', 'payment' => $payment], 201);
    }

    // Update an existing payment record
    public function update(Request $request, $invoiceId)
    {
        $payment = RecordPayment::where('invoice_id', $invoiceId)->first();

        if (!$payment) {
            return response()->json(['message' => 'Payment record not found.'], 404);
        }

        $validatedData = $request->validate([
            'receipt_number' => 'required|string',
            'amount' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'payment_status' => 'required|string',
            'payment_method' => 'required|string',
            'add_notes' => 'nullable|string'
        ]);

        $payment->update($validatedData);

        return response()->json(['message' => 'Payment updated successfully.', 'payment' => $payment], 200);
    }

    // // Retrieve invoice details and items associated with an invoice
    // public function getInvoiceDetails($id)
    // {
    //     $invoice = Invoice::with(['student', 'items'])->findOrFail($id);
    //     return response()->json($invoice);
    // }

    // Delete a payment record
    public function destroy($invoiceId)
    {
        $payment = RecordPayment::where('invoice_id', $invoiceId)->first();

        if (!$payment) {
            return response()->json(['message' => 'Payment record not found.'], 404);
        }

        $payment->delete();

        return response()->json(['message' => 'Payment record deleted successfully.'], 200);
    }

    /**
     * Send payment receipts as PDF attachments via email.
     */
    public function sendReceiptPdfEmail(Request $request)
    {
        $request->validate([
            'emails' => 'required|array',
            'emails.*' => 'email', // Validate each email
            'pdf' => 'required|file|mimes:pdf|max:2048',
        ]);

        // Fetch the center profile
        $centerData = CenterProfile::first();

        // Save the uploaded PDF temporarily
        $pdfPath = $request->file('pdf')->store('receipts');

        $absolutePath = storage_path("app/{$pdfPath}");

        foreach ($request->emails as $email) {
            Mail::to($email)->send(new PaymentReceiptMail($absolutePath, $centerData));
        }

        return response()->json(['message' => 'Payment receipts sent successfully.']);
    }

    // Filter payments by date
    public function filterPayments(Request $request)
    {
        try {
            // Default to 'this_month' if no date filter is provided
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

            // Retrieve payments filtered by the date, with the associated invoice data
            $payments = RecordPayment::with('invoice')
                ->where('payment_date', '>=', $startDate)
                ->orderBy('id', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'payments' => RecordPaymentResource::collection($payments)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching payments: ' . $e->getMessage()
            ], 500);
        }
    }
}