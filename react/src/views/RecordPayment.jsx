import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axiosClient";
import { Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import { Table } from "../components/Table/Table";
import SearchBar from "../components/SearchBar";
import Dropdown from "react-bootstrap/Dropdown";
import "../css/RecordPayment.css";

export default function RecordPayment() {
    const [recordPaymentData, setRecordPaymentData] = useState({
        record_payments: [],
        loading: true,
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [error, setError] = useState("");
    const [dateFilter, setDateFilter] = useState("this_month");

    // Fetch record payment data
    useEffect(() => {
        async function fetchRecordPayments() {
            try {
                // Fetch data from /record-payments endpoint
                const res = await axiosClient.get(
                    `/record-payments?date_filter=${dateFilter}`
                );

                setRecordPaymentData({
                    record_payments: res.data.payments || [],
                    loading: false,
                });
            } catch (error) {
                console.error("Error fetching record payment:", error);
                setRecordPaymentData({
                    record_payments: [], 
                    loading: false,
                });
                setError(
                    "Error fetching record payment data. Please try again later."
                );
            }
        }

        // Call fetchRecordPayments function
        fetchRecordPayments();
    }, [dateFilter]); // Re-fetch when dateFilter changes

    // Handle deletion of a record payment
    const handleDelete = async (id) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this record payment?"
            )
        ) {
            return;
        }
        try {
            // Delete invoice with the given ID
            await axiosClient.delete(`/record-payment-for/invoice/${id}`);

            // Update state to remove the deleted record payment
            setRecordPaymentData((prevState) => ({
                ...prevState,
                record_payments: prevState.record_payments.filter(
                    (payment) => payment.invoice_id !== id
                ),
            }));
        } catch (error) {
            console.error("Error deleting record payment:", error);
            setError("Error deleting record payment. Please try again later.");
        }
    };

    // Filter record payments by student name and status
    const filteredRecordPayments = recordPaymentData.record_payments.filter(
        (payment) => {
            const matchesName = payment.invoice.student.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter
                ? payment.payment_status.toLowerCase() ===
                  statusFilter.toLowerCase()
                : true; // If no status filter is applied, show all statuses

            return matchesName && matchesStatus;
        }
    );

    // Table header and data
    const tableHeader = [
        "Receipt Number",
        "Invoice Number",
        "Student Name",
        "Amount Paid (RM)",
        "Balance (RM)",
        "Due Date",
        "Payment Method",
        "Payment Date",
        "Status",
        "Actions",
    ];

    const tableData = recordPaymentData.loading
        ? [
              [
                  <td key="loading" colSpan="8" className="text-center">
                      Loading...
                  </td>,
              ],
          ]
        : // Map record payment data to table rows
          filteredRecordPayments.map((payment) => [
              payment.receipt_number || "-",
              payment.invoice.invoice_number || "-",
              payment.invoice.student.name || "-",
              payment.amount || "-",
              // Balance After Payment
              payment.invoice.total_payable && payment.amount
                  ? (payment.invoice.total_payable - payment.amount).toFixed(2)
                  : "-",
              payment.invoice.due_date || "-",
              payment.payment_method || "-",
              payment.payment_date || "-",
              <div key={`status-${payment.id}`} className="table-cell-center">
                  <span
                      className={`status-badge ${
                          payment.payment_status === "paid"
                              ? "status-paid"
                              : payment.payment_status === "pending"
                              ? "status-pending"
                              : "status-overdue"
                      }`}
                  >
                      {payment.payment_status || "-"}
                  </span>
              </div>,
              <div className="actions" key={`actions-${payment.id}`}>
                  <Dropdown>
                      <Dropdown.Toggle
                          as="div"
                          id={`dropdown-${payment.id}`}
                          className="p-0"
                      >
                          <img
                              src="http://localhost:8000/icon/more.png"
                              alt="More"
                              style={{ cursor: "pointer" }}
                          />
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                          <Dropdown.Item
                              as={Link}
                              to={`/record-payment-for/invoice/${payment.invoice_id}`}
                          >
                              Edit Payment
                          </Dropdown.Item>
                          <Dropdown.Item
                              as={Link}
                              to={`/receipt-template-for/invoice/${payment.invoice_id}`}
                          >
                              View Receipt
                          </Dropdown.Item>
                          <Dropdown.Item
                              onClick={() => handleDelete(payment.invoice_id)}
                          >
                              Delete Payment
                          </Dropdown.Item>
                      </Dropdown.Menu>
                  </Dropdown>
              </div>,
          ]);

    return (
        <>
            <div className="page-title">Fees</div>

            {/* Date Filter */}
            <div className="date-filter mt-5">
                <button
                    className={`btn ${
                        dateFilter === "this_month"
                            ? "btn-primary"
                            : "btn-outline-primary"
                    }`}
                    onClick={() => setDateFilter("this_month")}
                >
                    This Month
                </button>
                <button
                    className={`btn ms-3 ${
                        dateFilter === "last_3_months"
                            ? "btn-primary"
                            : "btn-outline-primary"
                    }`}
                    onClick={() => setDateFilter("last_3_months")}
                >
                    Last 3 Months
                </button>
            </div>

            {/* Display record payment list table */}
            <ContentContainer title="Payment Collection List">
                <Row className="mb-3">
                    <Col md={4}>
                        {/* Filter by status */}
                        <Form>
                            <Form.Group controlId="statusFilter">
                                <Form.Select
                                    name="status"
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                >
                                    <option value="">
                                        Filter payment status
                                    </option>
                                    <option value="paid">Paid</option>
                                    <option value="pending">Pending</option>
                                    <option value="overdue">Overdue</option>
                                </Form.Select>
                            </Form.Group>
                        </Form>
                    </Col>

                    <Col md={8}>
                        {/* Search by student name */}
                        <SearchBar
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            placeholder="Search student by name"
                        />
                    </Col>
                </Row>

                {error && <div className="alert alert-danger">{error}</div>}
                <Table
                    header={tableHeader}
                    data={tableData}
                    itemsPerPage={10}
                />
            </ContentContainer>
        </>
    );
}
