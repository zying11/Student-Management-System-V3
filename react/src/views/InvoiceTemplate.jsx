import React from 'react';
import jsPDF from 'jspdf';

export default function InvoiceTemplate({ invoice }) {
  // Calculate total amount
  const totalAmount = invoice.items.reduce((acc, item) => {
    return acc + item.quantity * item.price;
  }, 0);

  const handlePrintPDF = () => {
    const doc = new jsPDF();
    doc.text('Invoice', 10, 10);
    doc.text(`Invoice #: ${invoice.id}`, 10, 20);
    doc.text(`Date: ${invoice.date}`, 10, 30);
    doc.text(`Student Name: ${invoice.customerName}`, 10, 40);
    doc.text(`Address: ${invoice.address}`, 10, 50);
    doc.text(`Email: ${invoice.email}`, 10, 60);
    doc.text('Item', 10, 70);
    doc.text('Quantity', 80, 70);
    doc.text('Price', 110, 70);
    doc.text('Total', 140, 70);

    let y = 80;
    invoice.items.forEach((item, index) => {
      const yPos = y + index * 10;
      doc.text(item.name, 10, yPos);
      doc.text(item.quantity.toString(), 80, yPos);
      doc.text(item.price.toString(), 110, yPos);
      doc.text((item.quantity * item.price).toString(), 140, yPos);
    });

    doc.text(`Total: RM${totalAmount.toFixed(2)}`, 10, y + invoice.items.length * 10 + 10);

    doc.save(`Invoice_${invoice.id}.pdf`);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h2>Invoice</h2>
          <div>Invoice #: {invoice.id}</div>
          <div>Date: {invoice.date}</div>
        </div>
        <div className="col">
          <div>Student Name: {invoice.customerName}</div>
          <div>Address: {invoice.address}</div>
          <div>Email: {invoice.email}</div>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>RM{item.price.toFixed(2)}</td>
              <td>RM{(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="invoice-total">
        <strong>Total: RM{totalAmount.toFixed(2)}</strong>
      </div>
      <button className="btn btn-primary" onClick={handlePrintPDF}>Generate PDF</button>
    </div>
  );
}
