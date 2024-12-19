import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axiosClient";
import { Form } from "react-bootstrap";
import Button from "../components/Button/Button";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Table } from "react-bootstrap";
import React from "react";

export default function RecordPaymentForm() {
    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [isEditing, setIsEditing] = useState(false);

    const [errors, setErrors] = useState({});

    const [invoiceDetails, setInvoiceDetails] = useState(null);

    const [paymentDetails, setPaymentDetails] = useState({
        invoice_id: id,
        receipt_number: "",
        amount: "",
        payment_date: "",
        payment_status: "",
        payment_method: "",
        add_notes: "",
    });

    // Fetch invoice details and payment record if exists
    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                // Fetch invoice details
                const invoiceResponse = await axiosClient.get(
                    `/invoices/${id}`
                );
                setInvoiceDetails(invoiceResponse.data);

                // Check if a payment record exists
                try {
                    const paymentResponse = await axiosClient.get(
                        `/record-payment-for/invoice/${id}`
                    );
                    const paymentData = paymentResponse.data;

                    // Check if paymentData is valid
                    if (paymentData && Object.keys(paymentData).length > 0) {
                        setPaymentDetails(paymentData);
                        setIsEditing(true);
                    }
                } catch (paymentError) {
                    // Handle no payment found (404 error)
                    if (
                        paymentError.response &&
                        paymentError.response.status === 404
                    ) {
                        console.log(
                            "No payment found. Preparing for a new record."
                        );
                        setIsEditing(false);

                        // Fetch generated receipt number for new record payment
                        const receiptNumberResponse = await axiosClient.get(
                            "/generate-receipt-number"
                        );
                        setPaymentDetails((prevDetails) => ({
                            ...prevDetails,
                            receipt_number:
                                receiptNumberResponse.data.receipt_number,
                        }));
                    } else {
                        // Re-throw unexpected errors
                        throw paymentError;
                    }
                }
            } catch (error) {
                console.error("Error fetching details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    // Handle changes in payment details
    const handlePaymentChange = (ev) => {
        const { name, value } = ev.target;
        setPaymentDetails((prevPaymentDetails) => ({
            ...prevPaymentDetails,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            if (isEditing) {
                await axiosClient.put(
                    `/record-payment-for/invoice/${id}`,
                    paymentDetails
                );
            } else {
                await axiosClient.post("/record-payments", paymentDetails);
            }
            alert(
                `Record Payment ${
                    isEditing ? "updated" : "created"
                } successfully`
            );
            navigate("/record-payments");
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data.errors);
            } else {
                alert("Error saving payment: " + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // Validate payment details
    const validate = () => {
        const errors = {};
        if (!paymentDetails.payment_method) {
            errors.payment_method = ["The payment method field is required."];
        }
        if (!paymentDetails.add_notes) {
            errors.add_notes = ["The additional notes field is required."];
        }
        return errors;
    };

    return (
        <>
            <div className="page-title">Fees</div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                invoiceDetails && (
                    <Form onSubmit={handleSubmit}>
                        <div>
                            {isEditing ? "Edit Payment" : "Create Payment"}
                        </div>

                        <ContentContainer title="Record Payment">
                            <Row className="mb-3">
                                <Form.Group
                                    as={Col}
                                    controlId="formReceiptNumber"
                                >
                                    <Form.Label>Receipt Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="receipt_number"
                                        value={paymentDetails.receipt_number}
                                        placeholder="Generated Receipt Number"
                                        isInvalid={!!errors.receipt_number}
                                        readOnly
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.receipt_number}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group
                                    as={Col}
                                    controlId="formPaymentDate"
                                >
                                    <Form.Label>Payment Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="payment_date"
                                        value={paymentDetails.payment_date}
                                        onChange={handlePaymentChange}
                                        placeholder="Select payment date"
                                        isInvalid={!!errors.payment_date}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.payment_date}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group
                                    as={Col}
                                    controlId="formpaymentAmount"
                                >
                                    <Form.Label>Amount Paid (RM)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="amount"
                                        value={paymentDetails.amount}
                                        onChange={handlePaymentChange}
                                        placeholder="Enter amount paid"
                                        isInvalid={!!errors.amount}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.amount}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group
                                    as={Col}
                                    controlId="formPaymentStatus"
                                >
                                    <Form.Label>Payment Status</Form.Label>
                                    <Form.Select
                                        name="payment_status"
                                        value={paymentDetails.payment_status}
                                        onChange={handlePaymentChange}
                                        isInvalid={!!errors.payment_status}
                                    >
                                        <option value="" disabled>
                                            Select payment status
                                        </option>
                                        <option value="paid">Paid</option>
                                        <option value="pending">Pending</option>
                                        <option value="overdue">Overdue</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.payment_status}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group
                                    as={Col}
                                    controlId="formPaymentMethod"
                                >
                                    <Form.Label>Payment Method</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="payment_method"
                                        value={paymentDetails.payment_method}
                                        onChange={handlePaymentChange}
                                        placeholder="Enter payment method"
                                        isInvalid={!!errors.payment_method}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.payment_method && (
                                            <p className="error-message">
                                                {errors.payment_method}
                                            </p>
                                        )}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formNotes">
                                    <Form.Label>Additional Notes</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="add_notes"
                                        value={paymentDetails.add_notes}
                                        onChange={handlePaymentChange}
                                        placeholder="Enter additional notes"
                                        isInvalid={!!errors.add_notes}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.add_notes}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Row className="mt-5">
                                <hr />
                            </Row>

                            <Row>
                                <h5 className="mb-3">Invoice Details</h5>
                                <Row>
                                    <Col xs="12" md="8">
                                        <ul className="list-unstyled invoice-student-info">
                                            <li className="text-muted">
                                                To:{" "}
                                                <span className="invoice-student-name">
                                                    {
                                                        invoiceDetails.student
                                                            .name
                                                    }
                                                </span>
                                            </li>
                                            <li className="text-muted">
                                                {invoiceDetails.student.address}
                                            </li>
                                            <li className="text-muted">
                                                Postal Code:{" "}
                                                {
                                                    invoiceDetails.student
                                                        .postal_code
                                                }
                                            </li>
                                            <li className="text-muted">
                                                <i className="fas fa-phone-alt"></i>{" "}
                                                {
                                                    invoiceDetails.student
                                                        .nationality
                                                }
                                            </li>
                                        </ul>
                                    </Col>
                                    <Col xs="12" md="4">
                                        <ul className="list-unstyled invoice-details">
                                            <li className="text-muted">
                                                <i className="fas fa-circle invoice-detail-icon"></i>
                                                <span className="fw-bold ms-1">
                                                    Invoice Number:
                                                </span>{" "}
                                                {invoiceDetails.invoice_number}
                                            </li>
                                            <li className="text-muted">
                                                <i className="fas fa-circle invoice-detail-icon"></i>
                                                <span className="fw-bold ms-1">
                                                    Issue Date:
                                                </span>{" "}
                                                {invoiceDetails.issue_date}
                                            </li>
                                            <li className="text-muted">
                                                <i className="fas fa-circle invoice-detail-icon"></i>
                                                <span className="fw-bold ms-1">
                                                    Due Date:
                                                </span>{" "}
                                                {invoiceDetails.due_date}
                                            </li>
                                        </ul>
                                    </Col>
                                </Row>
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
                                        {invoiceDetails.items.map(
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
                                <Col xs="12">
                                    <ul className="list-unstyled invoice-summary">
                                        <li className="text-muted d-flex justify-content-end">
                                            <span className="me-4">
                                                SubTotal
                                            </span>
                                            RM {invoiceDetails.total_payable}
                                        </li>
                                        <li className="text-muted mt-2 d-flex justify-content-end">
                                            <span className="me-4">
                                                Tax (0%)
                                            </span>
                                            RM{" "}
                                            {(
                                                invoiceDetails.total_payable * 0
                                            ).toFixed(2)}
                                        </li>
                                        <li className="fw-bold mt-2 d-flex justify-content-end">
                                            <span className="me-4">
                                                Total Amount
                                            </span>
                                            RM{" "}
                                            {(
                                                invoiceDetails.total_payable * 1
                                            ).toFixed(2)}
                                        </li>
                                    </ul>
                                </Col>
                            </Row>
                        </ContentContainer>

                        <div className="d-flex justify-content-end mt-4 mb-4">
                            <Button
                                className="btn-create-yellow"
                                type="submit"
                                variant="primary"
                            >
                                {isEditing ? "Save" : "Create"}
                            </Button>
                        </div>
                    </Form>
                )
            )}
        </>
    );
}
