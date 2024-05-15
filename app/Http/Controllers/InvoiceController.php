<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use App\Http\Resources\InvoiceResource;
use App\Models\Invoice;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return InvoiceResource::collection(
            Invoice::query()->orderBy('id', 'desc')->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInvoiceRequest $request)
    {
        $data = $request->validated();

        // Calculate total payable
        $data['totalPayable'] = $data['subject1Fee'] + $data['subject2Fee'];

        // Initialize totalPaid and balance to 0
        $data['totalPaid'] = 0;
        $data['balance'] = $data['totalPayable'];

        $invoice = Invoice::create($data);
        return response(new InvoiceResource($invoice), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Invoice $invoice)
    {
        return new InvoiceResource($invoice);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInvoiceRequest $request, Invoice $invoice)
    {
        $data = $request->validated();

        // Recalculate total payable
        $data['totalPayable'] = $data['subject1Fee'] + $data['subject2Fee'];

        // Calculate balance by subtracting totalPaid from totalPayable
        $data['balance'] = $data['totalPayable'] - $invoice->totalPaid;

        $invoice->update($data);
        return new InvoiceResource($invoice);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoice $invoice)
    {
        $invoice->delete();
        return response('', 204);
    }
}
