import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axiosClient";
import { Form, Spinner } from "react-bootstrap";
import Button from "../components/Button/Button";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Table } from "react-bootstrap";
import React from "react";

export default function InvoiceForm({ isEditing }) {
    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({});

    const [invoiceDetails, setInvoiceDetails] = useState({
        invoice_number: "",
        issue_date: "",
        due_date: "",
        student_id: "",
        payment_method: "",
        add_notes: "",
        total_payable: 0,
    });

    const [invoiceItems, setInvoiceItems] = useState([
        {
            item_name: "",
            quantity: 0,
            price: 0,
            discount: 0,
            total: 0,
            isManual: false,
        },
    ]);

    const [students, setStudents] = useState([]);

    // Function to handle changes in the invoice details
    const handleInvoiceChange = (ev) => {
        const { name, value } = ev.target;

        // Update invoice details
        setInvoiceDetails((prevInvoiceDetails) => ({
            ...prevInvoiceDetails,
            [name]: value,
        }));

        // Clear the specific error when user starts typing
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
        }));

        // When selecting a student, fetch student-related data
        if (name === "student_id" && value !== "") {
            const selectedStudent = students.find(
                (student) => student.id === parseInt(value)
            );
            if (selectedStudent) {
                // Load student-related items here, possibly based on enrollment
                const updatedItems =
                    populateItemsBasedOnStudent(selectedStudent);
                setInvoiceItems(updatedItems);
                setInvoiceDetails((prevDetails) => ({
                    ...prevDetails,
                    total_payable: calculateTotalPayable(updatedItems),
                }));
            } else {
                // Clear items if no student is selected
                setInvoiceItems([
                    {
                        item_name: "",
                        quantity: 0,
                        price: 0,
                        discount: 0,
                        total: 0,
                    },
                ]);
                setInvoiceDetails((prevDetails) => ({
                    ...prevDetails,
                    total_payable: 0,
                }));
            }
        }
    };

    // Function to populate items based on the selected student
    const populateItemsBasedOnStudent = (selectedStudent) => {
        // If the student has no enrollments, create a manual item
        if (
            !selectedStudent.enrollments ||
            selectedStudent.enrollments.length === 0
        ) {
            return [
                {
                    item_name: "",
                    quantity: 1,
                    price: 0,
                    discount: 0,
                    total: calculateItemTotal({
                        quantity: 1,
                        price: enrollment.subject.subject_fee,
                        discount: 0,
                    }),
                    isManual: true,
                },
            ];
        }

        // Create invoice items based on the student's enrollments
        const items = selectedStudent.enrollments.map((enrollment) => {
            return {
                item_name: enrollment.subject.subject_name,
                quantity: 1,
                price: enrollment.subject.subject_fee,
                discount: 0,
                total: calculateItemTotal({
                    quantity: 1,
                    price: enrollment.subject.subject_fee,
                    discount: 0,
                }),
                isManual: false,
            };
        });

        return items;
    };

    // Function to handle changes in the invoice items
    const handleItemChange = (index, ev) => {
        const { name, value } = ev.target;
        const updatedItems = [...invoiceItems];
        updatedItems[index][name] = value;

        // Recalculate total for the item
        updatedItems[index].total = calculateItemTotal(updatedItems[index]);

        setInvoiceItems(updatedItems);
        setInvoiceDetails((prevDetails) => ({
            ...prevDetails,
            total_payable: calculateTotalPayable(updatedItems),
        }));
    };

    // Calculate total for each item
    const calculateItemTotal = (item) => {
        const priceAfterDiscount = item.price * ((100 - item.discount) / 100);
        return priceAfterDiscount * item.quantity;
    };

    // Calculate the final total payable
    const calculateTotalPayable = (items) => {
        return items.reduce(
            (acc, item) => acc + parseFloat(item.total || 0),
            0
        );
    };

    // Add a new empty item to the invoice
    const addInvoiceItem = () => {
        setInvoiceItems([
            ...invoiceItems,
            {
                item_name: "",
                quantity: 0,
                price: 0,
                discount: 0,
                total: 0,
                isManual: true,
            },
        ]);
    };

    // Remove an item from the invoice
    const removeInvoiceItem = (index) => {
        const updatedItems = invoiceItems.filter((_, i) => i !== index);
        setInvoiceItems(updatedItems);
        setInvoiceDetails((prevDetails) => ({
            ...prevDetails,
            total_payable: calculateTotalPayable(updatedItems),
        }));
    };

    useEffect(() => {
        // for populating the dropdown (customer name)
        const fetchStudent = async () => {
            const studentsResponse = await axiosClient.get("/students");
            const studentsData = studentsResponse.data.data;
            setStudents(studentsData);
        };
        fetchStudent();

        // if is editing, fetch the invoice data
        const fetchInvoiceData = async () => {
            setLoading(true);
            try {
                if (isEditing && id) {
                    const invoiceResponse = await axiosClient.get(
                        `/invoices/${id}`
                    );
                    const invoiceData = invoiceResponse.data;
                    setInvoiceDetails((prevDetails) => ({
                        ...prevDetails,
                        ...invoiceData,
                    }));
                    setInvoiceItems(invoiceData.items);
                } else {
                    // Fetch generated invoice number for new invoice
                    const invoiceNumberResponse = await axiosClient.get(
                        "/generate-invoice-number"
                    );
                    setInvoiceDetails((prevDetails) => ({
                        ...prevDetails,
                        invoice_number:
                            invoiceNumberResponse.data.invoice_number,
                    }));
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoiceData();
    }, [isEditing, id]);

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate input fields
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Set loading to true while saving data
        setLoading(true);
        try {
            // If editing, update the invoice details
            if (isEditing) {
                await axiosClient.put(`/invoices/${id}`, invoiceDetails);

                // If creating a new invoice
            } else {
                // Create the user
                await axiosClient.post("/invoices", {
                    ...invoiceDetails,
                    items: invoiceItems,
                });
            }

            alert(`Invoice ${isEditing ? "updated" : "created"} successfully`);

            // Redirect to the student fees collection list page
            navigate("/invoices");
        } catch (error) {
            // Handle error when saving data
            if (error.response && error.response.data) {
                setErrors(error.response.data.errors);
            } else {
                alert("Error saving invoice: " + error.message);
            }
        } finally {
            // Set loading to false after saving data
            setLoading(false);
        }
    };

    // Function to validate input fields
    const validate = () => {
        const errors = {};

        // Required field checks for main invoice fields
        if (!invoiceDetails.issue_date) {
            errors.issue_date = ["The issue date field is required."];
        }
        if (!invoiceDetails.due_date) {
            errors.due_date = ["The due date field is required."];
        }
        if (!invoiceDetails.student_id) {
            errors.student_id = ["The customer name field is required."];
        }

        // Items validation
        invoiceItems.forEach((item, index) => {
            if (item.isManual) {
                if (!item.item_name) {
                    errors[`items.${index}.item_name`] = [
                        "The item name is required.",
                    ];
                }
                if (item.price < 0) {
                    errors[`items.${index}.price`] = [
                        "The item price cannot be negative.",
                    ];
                }
            }
            // Validate quantity and discount for all items
            if (item.quantity <= 0) {
                errors[`items.${index}.quantity`] = [
                    "The quantity must be greater than 0.",
                ];
            }
            if (item.discount < 0 || item.discount > 100) {
                errors[`items.${index}.discount`] = [
                    "Discount must be between 0 and 100.",
                ];
            }
        });

        if (!invoiceDetails.payment_method) {
            errors.payment_method = ["The payment method field is required."];
        }

        if (!invoiceDetails.add_notes) {
            errors.add_notes = ["The additional notes field is required."];
        }

        return errors;
    };

    return (
        <>
            <div className="page-title">Fees</div>
            {loading ? (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "400px" }}
                >
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Form onSubmit={handleSubmit}>
                    <ContentContainer title="Invoice Details">
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formInvoiceNumber">
                                <Form.Label>Invoice Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="invoice_number"
                                    value={invoiceDetails.invoice_number}
                                    placeholder="Generated Invoice Number"
                                    isInvalid={!!errors.invoice_number}
                                    readOnly
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.invoice_number}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formIssueDate">
                                <Form.Label>Issue Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="issue_date"
                                    value={invoiceDetails.issue_date}
                                    onChange={handleInvoiceChange}
                                    placeholder="Select issue date"
                                    isInvalid={!!errors.issue_date}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.issue_date}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formDueDate">
                                <Form.Label>Due Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="due_date"
                                    value={invoiceDetails.due_date}
                                    onChange={handleInvoiceChange}
                                    placeholder="Select due date"
                                    isInvalid={!!errors.due_date}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.due_date}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formCustomerName">
                                <Form.Label>Customer Name</Form.Label>
                                <Form.Select
                                    name="student_id"
                                    value={invoiceDetails.student_id}
                                    onChange={handleInvoiceChange}
                                    isInvalid={!!errors.student_id}
                                >
                                    <option value="" disabled>
                                        Select a student
                                    </option>
                                    {students.map((student) => (
                                        <option
                                            key={student.id}
                                            value={student.id}
                                        >
                                            {student.name}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {errors.student_id}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <h5 className="mt-5">Items</h5>
                        {invoiceItems.length > 0 && (
                            <div className="table-responsive">
                                <Table bordered striped className="mt-2">
                                    <thead>
                                        <tr>
                                            <th>Item Name</th>
                                            <th>Quantity</th>
                                            <th>Price (RM)</th>
                                            <th>Discount (%)</th>
                                            <th>Total (RM)</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoiceItems.map((item, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <Form.Control
                                                        type="text"
                                                        name="item_name"
                                                        value={item.item_name}
                                                        onChange={(ev) =>
                                                            handleItemChange(
                                                                index,
                                                                ev
                                                            )
                                                        }
                                                        isInvalid={
                                                            !!errors[
                                                                `items.${index}.item_name`
                                                            ]
                                                        }
                                                        disabled={
                                                            !item.isManual
                                                        } // Disable if it's not manually added
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors[
                                                            `items.${index}.item_name`
                                                        ]
                                                            ? errors[
                                                                  `items.${index}.item_name`
                                                              ][0]
                                                            : ""}
                                                    </Form.Control.Feedback>
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        type="number"
                                                        name="quantity"
                                                        value={item.quantity}
                                                        onChange={(ev) =>
                                                            handleItemChange(
                                                                index,
                                                                ev
                                                            )
                                                        }
                                                        isInvalid={
                                                            !!errors[
                                                                `items.${index}.quantity`
                                                            ]
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors[
                                                            `items.${index}.quantity`
                                                        ]
                                                            ? errors[
                                                                  `items.${index}.quantity`
                                                              ][0]
                                                            : ""}
                                                    </Form.Control.Feedback>
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        type="number"
                                                        name="price"
                                                        value={item.price}
                                                        onChange={(ev) =>
                                                            handleItemChange(
                                                                index,
                                                                ev
                                                            )
                                                        }
                                                        isInvalid={
                                                            !!errors[
                                                                `items.${index}.price`
                                                            ]
                                                        }
                                                        disabled={
                                                            !item.isManual
                                                        } // Disable if it's not manually added
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors[
                                                            `items.${index}.price`
                                                        ]
                                                            ? errors[
                                                                  `items.${index}.price`
                                                              ][0]
                                                            : ""}
                                                    </Form.Control.Feedback>
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        type="number"
                                                        name="discount"
                                                        value={item.discount}
                                                        onChange={(ev) =>
                                                            handleItemChange(
                                                                index,
                                                                ev
                                                            )
                                                        }
                                                        isInvalid={
                                                            !!errors[
                                                                `items.${index}.discount`
                                                            ]
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors[
                                                            `items.${index}.discount`
                                                        ]
                                                            ? errors[
                                                                  `items.${index}.discount`
                                                              ][0]
                                                            : ""}
                                                    </Form.Control.Feedback>
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        type="number"
                                                        name="total"
                                                        value={item.total}
                                                        disabled
                                                    />
                                                </td>
                                                <td>
                                                    {item.isManual && (
                                                        <img
                                                            className="me-2"
                                                            src="http://localhost:8000/icon/delete.png"
                                                            alt="Delete"
                                                            onClick={() =>
                                                                removeInvoiceItem(
                                                                    index
                                                                )
                                                            }
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                        />
                                                    )}
                                                </td>
                                            </tr>
                                        ))}

                                        {/* Add a row for the total payable */}
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="text-end"
                                            >
                                                <strong>
                                                    Total Payable (RM):
                                                </strong>
                                            </td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    name="total_payable"
                                                    value={
                                                        invoiceDetails.total_payable
                                                    }
                                                    readOnly
                                                />
                                            </td>
                                            <td></td>{" "}
                                            {/* Empty cell for alignment */}
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        )}

                        {/* Button to manually add items */}
                        <img
                            className="ms-2"
                            src="http://localhost:8000/icon/add.png"
                            alt="Add"
                            onClick={() => addInvoiceItem()}
                            style={{ cursor: "pointer" }}
                        />

                        <Row className="mt-5 mb-3">
                            <Form.Group as={Col} controlId="formPaymentMethod">
                                <Form.Label>Payment Method</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="payment_method"
                                    value={invoiceDetails.payment_method}
                                    onChange={handleInvoiceChange}
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
                                    value={invoiceDetails.add_notes}
                                    onChange={handleInvoiceChange}
                                    placeholder="Enter additional notes"
                                    isInvalid={!!errors.add_notes}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.add_notes}
                                </Form.Control.Feedback>
                            </Form.Group>
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
            )}
        </>
    );
}
