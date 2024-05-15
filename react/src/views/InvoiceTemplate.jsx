// import React from 'react';
// import jsPDF from 'jspdf';

// export default function InvoiceTemplate({ invoice }) {
//   // Calculate total amount
//   const totalAmount = invoice.items.reduce((acc, item) => {
//     return acc + item.quantity * item.price;
//   }, 0);

//   const handlePrintPDF = () => {
//     const doc = new jsPDF();
//     doc.text('Invoice', 10, 10);
//     doc.text(`Invoice #: ${invoice.id}`, 10, 20);
//     doc.text(`Date: ${invoice.date}`, 10, 30);
//     doc.text(`Student Name: ${invoice.customerName}`, 10, 40);
//     doc.text(`Address: ${invoice.address}`, 10, 50);
//     doc.text(`Email: ${invoice.email}`, 10, 60);
//     doc.text('Item', 10, 70);
//     doc.text('Quantity', 80, 70);
//     doc.text('Price', 110, 70);
//     doc.text('Total', 140, 70);

//     let y = 80;
//     invoice.items.forEach((item, index) => {
//       const yPos = y + index * 10;
//       doc.text(item.name, 10, yPos);
//       doc.text(item.quantity.toString(), 80, yPos);
//       doc.text(item.price.toString(), 110, yPos);
//       doc.text((item.quantity * item.price).toString(), 140, yPos);
//     });

//     doc.text(`Total: RM${totalAmount.toFixed(2)}`, 10, y + invoice.items.length * 10 + 10);

//     doc.save(`Invoice_${invoice.id}.pdf`);
//   };

//   return (
//     <div className="container">
//       <div className="row">
//         <div className="col">
//           <h2>Invoice</h2>
//           <div>Invoice #: {invoice.id}</div>
//           <div>Date: {invoice.date}</div>
//         </div>
//         <div className="col">
//           <div>Student Name: {invoice.customerName}</div>
//           <div>Address: {invoice.address}</div>
//           <div>Email: {invoice.email}</div>
//         </div>
//       </div>
//       <table className="table">
//         <thead>
//           <tr>
//             <th>Item</th>
//             <th>Quantity</th>
//             <th>Price</th>
//             <th>Total</th>
//           </tr>
//         </thead>
//         <tbody>
//           {invoice.items.map((item, index) => (
//             <tr key={index}>
//               <td>{item.name}</td>
//               <td>{item.quantity}</td>
//               <td>RM{item.price.toFixed(2)}</td>
//               <td>RM{(item.quantity * item.price).toFixed(2)}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <div className="invoice-total">
//         <strong>Total: RM{totalAmount.toFixed(2)}</strong>
//       </div>
//       <button className="btn btn-primary" onClick={handlePrintPDF}>Generate PDF</button>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../axiosClient";
import jsPDF from 'jspdf';

export default function InvoiceTemplate() {
    const { id } = useParams();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [student, setStudent] = useState(null); // State to hold student data

    useEffect(() => {
        setLoading(true);
        axiosClient.get(`/invoices/${id}`)
            .then(({ data }) => {
                setLoading(false);
                setInvoice(data);
                // After fetching the invoice, fetch the associated student
                fetchStudent(data.student_id);
            })
            .catch(error => {
                setLoading(false);
                console.error("Error fetching invoice data:", error);
            });
    }, [id]);

    // Function to fetch student details based on ID
    const fetchStudent = (studentId) => {
        axiosClient.get(`/students/${id}`)
            .then(({ data }) => {
                setStudent(data);
            })
            .catch(error => {
                console.error("Error fetching student data:", error);
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!invoice) {
        return <div>Invoice not found.</div>;
    }

    const handlePrintPDF = () => {
   

        const doc = new jsPDF();
        doc.text('Invoice', 10, 10);
        doc.text(`Invoice #: ${invoice.id}`, 10, 20);
        doc.text(`Date: ${invoice.created_at}`, 10, 30);
        doc.text(`Student Name: ${ student.name}`, 10, 40); 
        doc.text(`Address: ${student.address}`, 10, 50);
        doc.text(`Age: ${student && student.age}`, 10, 70);
        doc.text('Item', 10, 80);
        doc.text('Fee', 80, 80);
        
        let y = 90;

        // Iterate over table rows
        document.querySelectorAll('table tbody tr').forEach((row, index) => {
            let x = 10;
            // Iterate over table columns within each row
            row.querySelectorAll('td').forEach((cell, cellIndex) => {
                doc.text(cell.innerText, x, y + index * 10);
                x += 70; // Adjust x position for the next cell
            });
        });
    
        doc.text(`Total Payable: RM${invoice.totalPayable}`, 10, y + 10 + 10 * document.querySelectorAll('table tbody tr').length);
        doc.text(`Total Paid: RM${invoice.totalPaid}`, 10, y + 20 + 10 * document.querySelectorAll('table tbody tr').length);
        doc.text(`Balance: RM${invoice.balance}`, 10, y + 30 + 10 * document.querySelectorAll('table tbody tr').length);
        
        doc.save(`Invoice_${invoice.id}.pdf`);
    };

    return (
            <div className="container">
              <div className="row">
                <div className="col">
                  <h2>Invoice</h2>
                  <div>Invoice #: {invoice.id}</div>
                  <div>Date: {invoice.created_at}</div>
                </div>
                <div className="col">
                  <div>Student Name: {invoice.name}</div>
                  <div>Address: {student && student.address}</div>
                  <div>Age: {student && student.age}</div>
                </div>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Fee</th>
                   
                  </tr>
                </thead>
                <tbody>
                 
                    <tr >
                      <td>Subject 1</td>
                      <td>RM {invoice.subject1Fee}</td>
                      
                    </tr>

                    <tr >
                      <td>Subject 2</td>
                      <td>RM {invoice.subject2Fee}</td>
               
                    </tr>
             
                </tbody>
              </table>
       
              <div className="invoice-total-payable">
                <strong>Total Payable: RM{invoice.totalPayable}</strong>
              </div>
              <div className="invoice-total-paid">
                <strong>Total Paid: RM{invoice.totalPaid}</strong>
              </div>
              <div className="invoice-total-balamce">
                <strong>Balance: RM{invoice.balance}</strong>
              </div>
              <button className="btn btn-primary" onClick={handlePrintPDF}>Generate PDF</button>
            </div>
          );
}

