import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../axiosClient";
import jsPDF from "jspdf";
import "jspdf-autotable";
import React from "react";
import { Container, Row, Col, Card, Table } from "react-bootstrap";
import Button from "../components/Button/Button";
import "../css//InvoiceTemplate.css";

export default function ReceiptTemplate() {
    const { id } = useParams();
    const [payment, setPayment] = useState({});
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

    // Fetch specific record payment data based on id
    useEffect(() => {
        setLoading(true);
        axiosClient
            .get(`/record-payment-for/invoice/${id}`)
            .then(({ data }) => {
                setLoading(false);
                setPayment(data);
            })
            .catch((error) => {
                setLoading(false);
                console.error("Error fetching payment data:", error);
            });
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!payment) {
        return <div>Payment not found.</div>;
    }

    if (!center) {
        return <div>Center profile not found.</div>;
    }

    const handlePrintPDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text(`${center.center_name || "Tuition Center"}`, 10, 10);

        // Receipt and Invoice Information
        doc.setFontSize(12);
        doc.text(`Receipt Number: ${payment.receipt_number || "N/A"}`, 10, 20);
        doc.text(
            `Invoice Number: ${payment?.invoice?.invoice_number || "N/A"}`,
            10,
            30
        );
        doc.text(`Payment Date: ${payment.payment_date || "N/A"}`, 10, 40);
        doc.text(`Due Date: ${payment?.invoice?.due_date || "N/A"}`, 10, 50);

        // Student Details
        doc.text(`To: ${payment?.invoice?.student?.name || "N/A"}`, 10, 70);
        doc.text(
            `Address: ${payment?.invoice?.student?.address || "N/A"}`,
            10,
            80
        );
        doc.text(
            `Postal Code: ${payment?.invoice?.student?.postal_code || "N/A"}`,
            10,
            90
        );
        doc.text(
            `Nationality: ${payment?.invoice?.student?.nationality || "N/A"}`,
            10,
            100
        );

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
            payment?.invoice?.items?.map((item, index) => [
                index + 1,
                item.item_name || "N/A",
                item.quantity || 0,
                item.price || 0,
                item.discount || 0,
                item.total || 0,
            ]) || [];

        // Render Table
        doc.autoTable({
            startY: 110,
            head: tableHead,
            body: tableBody,
        });

        // Total Summary
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.text(
            `Payment Method: ${payment.payment_method || "N/A"}`,
            10,
            finalY + 10
        );
        doc.text(
            `Additional Notes: ${payment.add_notes || "N/A"}`,
            10,
            finalY + 20
        );
        doc.text(
            `Subtotal: RM ${payment?.invoice?.total_payable || "0.00"}`,
            140,
            finalY + 10
        );
        doc.text(
            `Tax (0%): RM ${(payment?.invoice?.total_payable * 0).toFixed(2)}`,
            140,
            finalY + 20
        );
        doc.text(
            `Total Amount: RM ${payment?.invoice?.total_payable || "0.00"}`,
            140,
            finalY + 30
        );
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(
            `Total Paid: RM ${payment?.amount || "0.00"}`,
            140,
            finalY + 40
        );
        doc.text(
            `Balance: RM ${
                payment?.invoice?.total_payable && payment?.amount
                    ? (payment.invoice.total_payable - payment.amount).toFixed(
                          2
                      )
                    : "0.00"
            }`,
            140,
            finalY + 50
        );

        // Footer
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("Thank you!", 10, finalY + 70);

        // Save PDF
        doc.save(`Receipt_${payment.receipt_number || "N/A"}.pdf`);
    };

    // Function to handle sending the receipt (Send PDF via email)
    const handleSendReceipt = async (payment, center) => {
        const parentEmails =
            payment?.invoice?.student?.parents?.map((parent) => parent.email) ||
            [];

        if (parentEmails.length === 0) {
            alert("No parent emails found!");
            return;
        }

        try {
            const doc = new jsPDF();

            // Title
            doc.setFontSize(18);
            doc.text(`${center.center_name || "Tuition Center"}`, 10, 10);
            // doc.text(`${center.center_name || "Tuition Center"}`, 10, 10);

            // Receipt and Invoice Information
            doc.setFontSize(12);
            doc.text(
                `Receipt Number: ${payment.receipt_number || "N/A"}`,
                10,
                20
            );
            doc.text(
                `Invoice Number: ${payment?.invoice?.invoice_number || "N/A"}`,
                10,
                30
            );
            doc.text(`Payment Date: ${payment.payment_date || "N/A"}`, 10, 40);
            doc.text(
                `Due Date: ${payment?.invoice?.due_date || "N/A"}`,
                10,
                50
            );

            // Student Details
            doc.text(`To: ${payment?.invoice?.student?.name || "N/A"}`, 10, 70);
            doc.text(
                `Address: ${payment?.invoice?.student?.address || "N/A"}`,
                10,
                80
            );
            doc.text(
                `Postal Code: ${
                    payment?.invoice?.student?.postal_code || "N/A"
                }`,
                10,
                90
            );
            doc.text(
                `Nationality: ${
                    payment?.invoice?.student?.nationality || "N/A"
                }`,
                10,
                100
            );

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
                payment?.invoice?.items?.map((item, index) => [
                    index + 1,
                    item.item_name || "N/A",
                    item.quantity || 0,
                    item.price || 0,
                    item.discount || 0,
                    item.total || 0,
                ]) || [];

            // Render Table
            doc.autoTable({
                startY: 110,
                head: tableHead,
                body: tableBody,
            });

            // Total Summary
            const finalY = doc.lastAutoTable.finalY + 10;
            doc.text(
                `Payment Method: ${payment.payment_method || "N/A"}`,
                10,
                finalY + 10
            );
            doc.text(
                `Additional Notes: ${payment.add_notes || "N/A"}`,
                10,
                finalY + 20
            );
            doc.text(
                `Subtotal: RM ${payment?.invoice?.total_payable || "0.00"}`,
                140,
                finalY + 10
            );
            doc.text(
                `Tax (0%): RM ${(payment?.invoice?.total_payable * 0).toFixed(
                    2
                )}`,
                140,
                finalY + 20
            );
            doc.text(
                `Total Amount: RM ${payment?.invoice?.total_payable || "0.00"}`,
                140,
                finalY + 30
            );
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text(
                `Total Paid: RM ${payment?.amount || "0.00"}`,
                140,
                finalY + 40
            );
            doc.text(
                `Balance: RM ${
                    payment?.invoice?.total_payable && payment?.amount
                        ? (
                              payment.invoice.total_payable - payment.amount
                          ).toFixed(2)
                        : "0.00"
                }`,
                140,
                finalY + 50
            );

            // Footer
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text("Thank you!", 10, finalY + 70);

            // Convert the PDF to Blob
            const pdfBlob = doc.output("blob");

            // Create FormData to send the PDF
            const formData = new FormData();
            parentEmails.forEach((email) => formData.append("emails[]", email)); // Append each email
            formData.append("pdf", pdfBlob, "receipt.pdf"); // Attach the PDF

            // Send the PDF via email
            const response = await axiosClient.post(
                "/send-receipt-pdf-email",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            alert("Receipt sent to all parent emails!");
        } catch (error) {
            console.error("Error sending receipt:", error);
            alert("Failed to send receipt.");
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
                                        Receipt &gt; &gt;{" "}
                                        <strong>ID: {payment.id}</strong>
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
                                            handleSendReceipt(payment, center)
                                        }
                                        disabled={loading}
                                    >
                                        <i className="fas fa-paper-plane me-1"></i>{" "}
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
                                            {payment?.invoice?.student?.name}
                                        </span>
                                    </li>
                                    <li className="text-muted">
                                        {payment?.invoice?.student?.address}
                                    </li>
                                    <li className="text-muted">
                                        Postal Code:{" "}
                                        {payment?.invoice?.student?.postal_code}
                                    </li>
                                    <li className="text-muted">
                                        <i className="fas fa-phone-alt"></i>{" "}
                                        {payment?.invoice?.student?.nationality}
                                    </li>
                                </ul>
                            </Col>
                            <Col xs="12" md="4">
                                <p className="text-muted">Receipt Details</p>
                                <ul className="list-unstyled invoice-details">
                                    <li className="text-muted">
                                        <span className="fw-bold">
                                            Receipt Number:
                                        </span>{" "}
                                        {payment.receipt_number}
                                    </li>
                                    <li className="text-muted">
                                        <span className="fw-bold">
                                            Invoice Number:
                                        </span>{" "}
                                        {payment?.invoice?.invoice_number}
                                    </li>
                                    <li className="text-muted">
                                        <span className="fw-bold">
                                            Payment Date:
                                        </span>{" "}
                                        {payment.payment_date}
                                    </li>
                                    <li className="text-muted">
                                        <span className="fw-bold">
                                            Due Date:
                                        </span>{" "}
                                        {payment?.invoice?.due_date}
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
                                    {payment?.invoice?.items?.map(
                                        (item, index) => (
                                            <tr key={item.id}>
                                                <td>{index + 1}</td>
                                                <td>{item.item_name}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.price}</td>
                                                <td>{item.discount}</td>
                                                <td>{item.total}</td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </Table>
                        </Row>

                        <Row>
                            <Col xs="12" md="8">
                                <Row>
                                    <Col xs="12" md="6">
                                        <p>Payment Method:</p>{" "}
                                        {payment.payment_method}
                                    </Col>
                                </Row>

                                <Row className="mt-3">
                                    <Col xs="12" md="6">
                                        <p>Additional Notes:</p>{" "}
                                        {payment.add_notes}
                                    </Col>
                                </Row>
                            </Col>

                            <Col xs="12" md="4" className="mt-4 mt-md-0">
                                <ul className="list-unstyled invoice-summary">
                                    <li className="text-muted">
                                        <span className="me-4">SubTotal</span>RM{" "}
                                        {payment?.invoice?.total_payable}
                                    </li>
                                    <li className="text-muted mt-2">
                                        <span className="me-4">Tax (0%)</span>RM{" "}
                                        {(
                                            payment?.invoice?.total_payable * 0
                                        ).toFixed(2)}
                                    </li>
                                    <li className="text-muted mt-2">
                                        <span className="me-4">
                                            Total Amount
                                        </span>
                                        RM{" "}
                                        {(
                                            payment?.invoice?.total_payable * 1
                                        ).toFixed(2)}
                                    </li>
                                </ul>
                                <p className="fw-bold invoice-total">
                                    <span className="me-3">Total Paid</span>RM{" "}
                                    {(payment?.amount * 1).toFixed(2)}
                                </p>
                                <p className="fw-bold invoice-total">
                                    <span className="me-3">Balance</span>RM{" "}
                                    {payment?.invoice?.total_payable &&
                                    payment?.amount
                                        ? (
                                              payment.invoice.total_payable -
                                              payment.amount
                                          ).toFixed(2)
                                        : "0.00"}
                                </p>
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
                                    className="btn-create-purple me-2 mb-2 mb-md-0"
                                    onClick={handlePrintPDF}
                                >
                                    <i className="far fa-file-pdf me-1"></i>{" "}
                                    Export
                                </Button>

                                {/* Back Button */}
                                <Link to={`/record-payments`}>
                                    <Button className="btn-create-yellow">
                                        Back
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
