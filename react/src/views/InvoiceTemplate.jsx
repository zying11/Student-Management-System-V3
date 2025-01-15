import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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

    const [center, setCenter] = useState({});

    // Fetch center data
    useEffect(() => {
        async function fetchCenterProfile() {
            try {
                const res = await axiosClient.get(`/center-profile`);
                setCenter(res.data.centerProfile[0]);
            } catch (err) {
                console.error("Error fetching center profile data:", err);
                setError(
                    "Error fetching center profile data. Please try again."
                );
            } finally {
                setLoading(false);
            }
        }

        fetchCenterProfile();
    }, []);

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

    if (!center) {
        return <div>Center profile not found.</div>;
    }

    // Function to generate the invoice PDF
    const generateInvoicePDF = (invoice, center) => {
        const doc = new jsPDF();

        // Constants for page dimensions
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 10; // Margin for content
        let startY = margin; // Starting Y position

        // Function to add a new page and reset Y position
        const addNewPage = () => {
            doc.addPage();
            startY = margin; // Reset Y position for the new page
        };

        // Function to check if content exceeds page height and add a new page if needed
        const checkPageHeight = (requiredHeight) => {
            if (startY + requiredHeight > pageHeight - margin) {
                addNewPage();
            }
        };

        // Title
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(40, 40, 40); // Dark gray color
        doc.text(
            `${center.center_name || "Tuition Center"}`,
            pageWidth / 2,
            startY,
            {
                align: "center",
            }
        );
        startY += 15; // Move Y position down after the title

        // Add a horizontal line below the header
        doc.setDrawColor(200, 200, 200); // Light gray color
        doc.line(margin, startY, pageWidth - margin, startY);
        startY += 10; // Move Y position down after the line

        // Add invoice details
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(40, 40, 40);
        doc.text("Invoice Details", margin, startY);
        startY += 10;

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(
            `Invoice Number: ${invoice.invoice_number || "N/A"}`,
            margin,
            startY
        );
        startY += 10;
        doc.text(`Issue Date: ${invoice.issue_date || "N/A"}`, margin, startY);
        startY += 10;
        doc.text(`Due Date: ${invoice.due_date || "N/A"}`, margin, startY);
        startY += 20; // Add extra spacing

        // Add student details section
        doc.setFont("helvetica", "bold");
        doc.text("Student Details", margin, startY);
        startY += 10;
        doc.setFont("helvetica", "normal");
        doc.text(`To: ${invoice.student?.name || "N/A"}`, margin, startY);
        startY += 10;
        doc.text(
            `Address: ${invoice.student?.address || "N/A"}`,
            margin,
            startY
        );
        startY += 10;
        doc.text(
            `Postal Code: ${invoice.student?.postal_code || "N/A"}`,
            margin,
            startY
        );
        startY += 10;
        doc.text(
            `Nationality: ${invoice.student?.nationality || "N/A"}`,
            margin,
            startY
        );
        startY += 20; // Add extra spacing

        // Add items table
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Items", margin, startY);
        startY += 10;

        // Table Header
        const tableHead = [
            [
                "#",
                "Item Name",
                "Quantity",
                "Unit Price (RM)",
                "Discount (%)",
                "Total (RM)",
            ],
        ];
        const tableBody =
            invoice.items?.map((item, index) => [
                index + 1,
                item.item_name || "N/A",
                item.quantity || 0,
                item.price || 0,
                item.discount || 0,
                item.total || 0,
            ]) || [];

        // Render Table with Purple Styling
        doc.autoTable({
            startY: startY,
            head: tableHead,
            body: tableBody,
            theme: "striped", // Add styling to the table
            headStyles: {
                fillColor: [169, 160, 225], // Purple color (#a9a0e1 in RGB)
                textColor: [255, 255, 255], // White text for contrast
                fontStyle: "bold", // Bold header text
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245], // Light gray alternate rows
            },
            bodyStyles: {
                textColor: [40, 40, 40], // Dark gray text for body
            },
            didDrawPage: (data) => {
                // Update startY after the table is drawn
                startY = data.cursor.y + 10;
            },
        });

        // Check if the table exceeded the page height
        checkPageHeight(50); // Add extra space for the summary section

        // Add a horizontal line below the table
        doc.line(margin, startY, pageWidth - margin, startY);
        startY += 10;

        // Ensure Payment Summary starts on a new page if needed
        const paymentSummaryHeight = 150; // Approximate height of the Payment Summary section
        if (startY + paymentSummaryHeight > pageHeight - margin) {
            addNewPage(); // Force a new page if there isn't enough space
        }

        // Add payment summary section
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Payment Summary", margin, startY);
        startY += 10;

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(
            `Payment Method: ${invoice.payment_method || "N/A"}`,
            margin,
            startY
        );
        startY += 10;
        doc.text(
            `Additional Notes: ${invoice.add_notes || "N/A"}`,
            margin,
            startY
        );
        startY += 10;

        // Right-aligned subtotal and totals
        const rightAlignX = pageWidth - margin; // Right margin for alignment
        doc.text(
            `Subtotal: RM ${invoice.total_payable || "0.00"}`,
            rightAlignX,
            startY,
            { align: "right" }
        );
        startY += 10;
        doc.text(
            `Tax (0%): RM ${(invoice.total_payable * 0).toFixed(2)}`,
            rightAlignX,
            startY,
            { align: "right" }
        );
        startY += 10;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(
            `Total Amount: RM ${invoice.total_payable || "0.00"}`,
            rightAlignX,
            startY,
            { align: "right" }
        );
        startY += 20; // Add extra spacing

        // Add a footer
        checkPageHeight(20); // Ensure there's enough space for the footer
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100); // Gray color
        const footerText = `Invoice generated by: ${
            center.center_name || "Tuition Center"
        }`;
        doc.text(footerText, margin, doc.internal.pageSize.height - 10);

        return doc;
    };

    const handlePrintPDF = () => {
        const doc = generateInvoicePDF(invoice, center);
        doc.save(`${invoice.invoice_number || "N/A"}.pdf`);
    };

    const handleSendInvoice = async (invoice, center) => {
        setLoading(true);

        const parentEmails =
            invoice?.student?.parents?.map((parent) => parent.email) || [];

        if (parentEmails.length === 0) {
            alert("No parent emails found!");
            return;
        }

        try {
            const doc = generateInvoicePDF(invoice, center);

            // Convert the PDF to Blob
            const pdfBlob = doc.output("blob");

            // Create FormData to send the PDF
            const formData = new FormData();
            parentEmails.forEach((email) => formData.append("emails[]", email)); // Append each email
            formData.append("pdf", pdfBlob, "invoice.pdf"); // Attach the PDF

            const response = await axiosClient.post(
                "/send-invoice-pdf-email",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            alert("Invoice sent to all parent emails!");
        } catch (error) {
            console.error("Error sending invoice:", error);
            alert("Failed to send invoice.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="page-title text-center text-md-start">Fees</div>

            <Container className="invoice-container px-3 px-md-0 py-3">
                <Card className="invoice-card p-3 p-md-4">
                    <Card.Body>
                        <Container className="invoice-header mb-3">
                            <Row className="d-flex align-items-center">
                                <Col
                                    xs="12"
                                    md="9"
                                    className="text-center text-md-start"
                                >
                                    <p className="invoice-path">
                                        Invoice &gt; &gt;{" "}
                                        <strong>ID: {invoice.id}</strong>
                                    </p>
                                </Col>
                                <Col
                                    xs="12"
                                    md="3"
                                    className="text-center text-md-end mt-2 mt-md-0"
                                >
                                    <Button
                                        className="btn-create-yellow-border"
                                        onClick={() =>
                                            handleSendInvoice(invoice, center)
                                        }
                                        disabled={loading}
                                    >
                                        <i className="fas fa-print me-1"></i>{" "}
                                        {loading ? "Sending..." : "Send"}
                                    </Button>
                                </Col>
                            </Row>
                        </Container>

                        <Container className="invoice-center text-center my-4">
                            <i className="fab fa-react fa-4x invoice-icon"></i>
                            <p className="pt-0 invoice-center-text">
                                {center.center_name}
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
                                <p className="text-muted">Invoice Details</p>
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

                        <Row className="my-3">
                            <Table
                                striped
                                bordered
                                hover
                                responsive="sm"
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
                                        <p>Payment Method:</p>{" "}
                                        {invoice.payment_method}
                                    </Col>
                                </Row>

                                <Row className="mt-3">
                                    <Col xs="12" md="6">
                                        <p>Additional Notes:</p>{" "}
                                        {invoice.add_notes}
                                    </Col>
                                </Row>
                            </Col>

                            <Col xs="12" md="4" className="mt-4 mt-md-0">
                                <ul className="list-unstyled invoice-summary">
                                    <li className="text-muted">
                                        <span className="me-4">SubTotal</span>RM{" "}
                                        {invoice.total_payable}
                                    </li>
                                    <li className="text-muted mt-2">
                                        <span className="me-4">Tax (0%)</span>RM{" "}
                                        {(invoice.total_payable * 0).toFixed(2)}
                                    </li>
                                    <li className="text-muted mt-2">
                                        <span className="me-4">
                                            Total Amount
                                        </span>
                                        RM{" "}
                                        {(invoice.total_payable * 1).toFixed(2)}
                                    </li>
                                </ul>
                            </Col>
                        </Row>

                        <hr />
                        <Row className="d-flex justify-content-center justify-content-md-start">
                            <Col
                                xs="12"
                                md="10"
                                className="text-center text-md-start"
                            >
                                <p>Thank you!</p>
                            </Col>
                        </Row>

                        <Row className="d-flex justify-content-center justify-content-md-end align-items-center">
                            <Col
                                xs="12"
                                md="auto"
                                className="text-center text-md-end mt-3 mt-md-0"
                            >
                                {/* Export Button */}
                                <Button
                                    className="btn-create-purple ms-2"
                                    onClick={handlePrintPDF}
                                >
                                    <i className="far fa-file-pdf me-1"></i>{" "}
                                    Export
                                </Button>

                                {/* Pay Now Button */}
                                <Link
                                    to={`/record-payment-for/invoice/${invoice.id}`}
                                >
                                    <Button className="btn-create-yellow ms-2">
                                        Pay
                                    </Button>
                                </Link>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}
