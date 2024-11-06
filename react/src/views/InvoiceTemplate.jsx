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
import jsPDF from "jspdf";
import "jspdf-autotable";
import React from "react";
import { Container, Row, Col, Card, Table } from "react-bootstrap";
import Button from "../components/Button/Button";
import "../css//InvoiceTemplate.css";

export default function InvoiceTemplate() {
    const { id } = useParams();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch specific invoice data based on id
    useEffect(() => {
        setLoading(true);
        axiosClient
            .get(`/invoices/${id}`)
            .then(({ data }) => {
                setLoading(false);
                setInvoice(data);
            })
            .catch((error) => {
                setLoading(false);
                console.error("Error fetching invoice data:", error);
            });
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!invoice) {
        return <div>Invoice not found.</div>;
    }

    const handlePrintPDF = () => {
        const doc = new jsPDF();

        // Document Title
        doc.setFontSize(18);
        doc.text("XXX Tuition Center", 10, 10);

        // Invoice and Student Details
        doc.setFontSize(12);
        doc.text(`Invoice Number: ${invoice.invoice_number}`, 10, 20);
        doc.text(`Issue Date: ${invoice.issue_date}`, 10, 30);
        doc.text(`Due Date: ${invoice.due_date}`, 10, 40);
        doc.text(`To: ${invoice.student.name}`, 10, 50);
        doc.text(`Address: ${invoice.student.address}`, 10, 60);
        doc.text(`Postal Code: ${invoice.student.postal_code}`, 10, 70);
        doc.text(`Nationality: ${invoice.student.nationality}`, 10, 80);

        // Itemized Table
        doc.autoTable({
            startY: 90,
            head: [
                [
                    "#",
                    "Item Name",
                    "Quantity",
                    "Unit Price (RM)",
                    "Discount (%)",
                    "Total (RM)",
                ],
            ],
            body: invoice.items.map((item, index) => [
                index + 1,
                item.item_name,
                item.quantity,
                item.price,
                item.discount,
                item.total,
            ]),
        });

        // Total and Payment Method
        // Calculate where to place after the table
        const finalY = doc.previousAutoTable.finalY + 10;

        doc.text(`Payment Method: ${invoice.payment_method}`, 10, finalY + 10);
        doc.text(`Notes: ${invoice.add_notes || "N/A"}`, 10, finalY + 30);

        // Total Summary
        doc.text(`Subtotal: RM ${invoice.total_payable}`, 140, finalY + 10);
        doc.text(`Tax (0%): RM ${invoice.total_payable * 0}`, 140, finalY + 20);
        doc.setFontSize(14);
        doc.text(`Total: RM ${invoice.total_payable}`, 140, finalY + 30);

        // Save PDF
        doc.save(`Invoice_${invoice.id}.pdf`);
    };

    return (
        <>
            <div className="page-title">Fees</div>

            <Container className="invoice-container px-0 py-3">
                <Card className="invoice-card p-4">
                    <Card.Body>
                        <Container className="invoice-header mb-2 mt-3">
                            <Row className="d-flex align-items-baseline">
                                <Col xs="12" md="9">
                                    <p className="invoice-path">
                                        Invoice &gt; &gt;{" "}
                                        <strong>ID: {invoice.id}</strong>
                                    </p>
                                </Col>
                                <Col
                                    xs="12"
                                    md="3"
                                    className="text-md-end text-center mt-2 mt-md-0"
                                >
                                    <Button className="btn-create-yellow-border">
                                        <i className="fas fa-print me-1"></i>{" "}
                                        Print
                                    </Button>
                                    <Button
                                        className="btn-create-purple ms-2"
                                        onClick={handlePrintPDF}
                                    >
                                        <i className="far fa-file-pdf me-1"></i>{" "}
                                        Export
                                    </Button>
                                </Col>
                            </Row>
                        </Container>

                        <Container className="invoice-center text-center mt-5">
                            <i className="fab fa-react fa-4x invoice-icon"></i>
                            <p className="pt-0 invoice-center-text">
                                XXX Tuition Center
                            </p>
                        </Container>

                        <Row>
                            <Col xs="12" md="8">
                                <ul className="list-unstyled invoice-student-info">
                                    <li className="text-muted">
                                        To:{" "}
                                        <span className="invoice-student-name">
                                            {invoice.student.name}
                                        </span>
                                    </li>
                                    <li className="text-muted">
                                        {invoice.student.address}
                                    </li>
                                    <li className="text-muted">
                                        Postal Code:{" "}
                                        {invoice.student.postal_code}
                                    </li>
                                    <li className="text-muted">
                                        <i className="fas fa-phone-alt"></i>{" "}
                                        {invoice.student.nationality}
                                    </li>
                                </ul>
                            </Col>
                            <Col xs="12" md="4">
                                <p className="text-muted">Invoice</p>
                                <ul className="list-unstyled invoice-details">
                                    <li className="text-muted">
                                        <i className="fas fa-circle invoice-detail-icon"></i>
                                        <span className="fw-bold ms-1">
                                            Invoice Number:
                                        </span>{" "}
                                        {invoice.invoice_number}
                                    </li>
                                    <li className="text-muted">
                                        <i className="fas fa-circle invoice-detail-icon"></i>
                                        <span className="fw-bold ms-1">
                                            Issue Date:
                                        </span>{" "}
                                        {invoice.issue_date}
                                    </li>
                                    <li className="text-muted">
                                        <i className="fas fa-circle invoice-detail-icon"></i>
                                        <span className="fw-bold ms-1">
                                            Due Date:
                                        </span>{" "}
                                        {invoice.due_date}
                                    </li>
                                </ul>
                            </Col>
                        </Row>

                        <Row className="my-2">
                            <Table
                                striped
                                bordered
                                hover
                                responsive
                                className="invoice-table"
                            >
                                <thead className="invoice-table-header">
                                    <tr>
                                        <th>#</th>
                                        <th>Item Name</th>
                                        <th>Quantity</th>
                                        <th>Unit Price (RM)</th>
                                        <th>Discount (%)</th>
                                        <th>Total (RM)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoice.items.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
                                            <td>{item.item_name}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.price}</td>
                                            <td>{item.discount}</td>
                                            <td>{item.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Row>

                        <Row>
                            <Col xs="12" md="8">
                                <Row>
                                    <Col xs="12" md="6">
                                        <p>Payment method info</p>{" "}
                                        {invoice.payment_method}
                                    </Col>
                                </Row>

                                <Row className="mt-3">
                                    <Col xs="12" md="6">
                                        <p>Additional notes</p>{" "}
                                        {invoice.add_notes}
                                    </Col>
                                </Row>
                            </Col>

                            <Col xs="12" md="4">
                                <ul className="list-unstyled invoice-summary">
                                    <li className="text-muted">
                                        <span className="me-4">SubTotal</span>RM{" "}
                                        {invoice.total_payable}
                                    </li>
                                    <li className="text-muted mt-2">
                                        <span className="me-4">Tax (0%)</span>RM{" "}
                                        {(invoice.total_payable * 0).toFixed(2)}
                                    </li>
                                </ul>
                                <p className="fw-bold invoice-total">
                                    <span className="me-3">Total Amount</span>
                                    <span className="invoice-total-amount">
                                        RM{" "}
                                        {(invoice.total_payable * 1).toFixed(2)}
                                    </span>
                                </p>
                            </Col>
                        </Row>

                        <hr />
                        <Row>
                            <Col xs="10">
                                <p>Thank you!</p>
                            </Col>
                            <Col xs="12" md="2" className="text-end">
                                <Button className="btn-create-yellow">
                                    Pay Now
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}
