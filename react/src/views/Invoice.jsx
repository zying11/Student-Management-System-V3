import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axiosClient";
import Button from "../components/Button/Button";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import { Table } from "../components/Table/Table";
import SearchBar from "../components/SearchBar";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../css/Invoice.css";

export default function Invoice() {
    const [invoiceData, setInvoiceData] = useState({
        invoices: [],
        loading: true,
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState("");
    const [dateFilter, setDateFilter] = useState("this_month");

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        // Check initial screen size
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Fetch invoice data with date filter
    useEffect(() => {
        async function fetchInvoices() {
            try {
                const res = await axiosClient.get(
                    `/invoices?date_filter=${dateFilter}`
                );
                setInvoiceData({
                    invoices: res.data.invoices,
                    loading: false,
                });
            } catch (error) {
                console.error("Error fetching invoices:", error);
                setInvoiceData({
                    invoices: [],
                    loading: false,
                });
                setError(
                    "Error fetching invoice data. Please try again later."
                );
            }
        }

        fetchInvoices();
    }, [dateFilter]); // Re-fetch when the dateFilter changes

    // Handle deletion of an invoice
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this invoice?")) {
            return;
        }
        try {
            // Delete invoice with the given ID
            await axiosClient.delete(`/invoices/${id}`);
            // Update state to remove the deleted invoice
            setInvoiceData((prevState) => ({
                ...prevState,
                invoices: prevState.invoices.filter(
                    (invoice) => invoice.id !== id
                ),
            }));
        } catch (error) {
            console.error("Error deleting invoice:", error);
            setError("Error deleting invoice. Please try again later.");
        }
    };

    // Filter invoices student name by search query
    const filteredInvoices = invoiceData.invoices.filter((invoice) =>
        invoice.student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Table header and data
    const tableHeader = [
        "Invoice Number",
        "Student Name",
        "Total Payable (RM)",
        "Issue Date",
        "Due Date",
        "Actions",
    ];

    const tableData = invoiceData.loading
        ? [
              [
                  <td key="loading" colSpan="6" className="text-center">
                      Loading...
                  </td>,
              ],
          ]
        : // Map invoice data to table rows
          filteredInvoices.map((invoice) => [
              invoice.invoice_number || "-",
              invoice.student.name || "-",
              invoice.total_payable || "-",
              invoice.issue_date || "-",
              invoice.due_date || "-",
              <div className="actions" key={`actions-${invoice.id}`}>
                  <Dropdown>
                      <Dropdown.Toggle
                          as="div"
                          id={`dropdown-${invoice.id}`}
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
                              to={`/invoice/edit/${invoice.id}`}
                          >
                              Edit Invoice
                          </Dropdown.Item>
                          <Dropdown.Item
                              as={Link}
                              to={`/invoiceTemplate/${invoice.id}`}
                          >
                              View Invoice
                          </Dropdown.Item>
                          <Dropdown.Item
                              onClick={() => handleDelete(invoice.id)}
                          >
                              Delete Invoice
                          </Dropdown.Item>
                          <Dropdown.Item
                              as={Link}
                              to={`/record-payment-for/invoice/${invoice.id}`}
                          >
                              Pay Now
                          </Dropdown.Item>
                      </Dropdown.Menu>
                  </Dropdown>
              </div>,
          ]);

    return (
        <>
            <div className="page-title text-center text-md-start mb-4">
                Fees
            </div>

            {/* Add Invoice Button */}
            <div className="d-flex justify-content-center justify-content-md-end mb-3">
                <Link to="/invoice/create" className="text-decoration-none">
                    <Button>Add Invoice</Button>
                </Link>
            </div>

            <ContentContainer title="Student Fees Collection List">
                {/* Date Filters*/}
                <Row className="g-3 mb-4">
                    {/* Date Filter - This Month */}
                    <Col xs={12} sm={6} md={3} lg={3}>
                        <button
                            className={`btn w-100 ${
                                dateFilter === "this_month"
                                    ? "btn-primary"
                                    : "btn-outline-primary"
                            }`}
                            onClick={() => setDateFilter("this_month")}
                        >
                            <i className="bi bi-calendar3 me-2"></i> This Month
                        </button>
                    </Col>

                    <Col xs={12} sm={6} md={3} lg={3}>
                        <button
                            className={`btn w-100 ${
                                dateFilter === "last_3_months"
                                    ? "btn-primary"
                                    : "btn-outline-primary"
                            }`}
                            onClick={() => setDateFilter("last_3_months")}
                        >
                            <i className="bi bi-calendar3-range me-2"></i> Last
                            3 Months
                        </button>
                    </Col>
                </Row>

                {/* Search Bar*/}
                <Row className="mb-4">
                    <Col
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        className="position-relative"
                    >
                        <SearchBar
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            placeholder={
                                isMobile
                                    ? "Search name"
                                    : "Search student by name"
                            }
                        />
                    </Col>
                </Row>

                {error && (
                    <div className="alert alert-danger text-center">
                        {error}
                    </div>
                )}

                {/* Table */}
                <Table
                    header={tableHeader}
                    data={tableData}
                    itemsPerPage={10}
                />
            </ContentContainer>
        </>
    );
}
