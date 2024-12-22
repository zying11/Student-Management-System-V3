import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axiosClient";
import Button from "../components/Button/Button";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import { Table } from "../components/Table/Table";
import SearchBar from "../components/SearchBar";
import Dropdown from "react-bootstrap/Dropdown";
import "../css/Invoice.css";

export default function Invoice() {
    const [invoiceData, setInvoiceData] = useState({
        invoices: [],
        loading: true,
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState("");
    const [dateFilter, setDateFilter] = useState("this_month");

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
            <div className="page-title">Fees</div>

            <div className="d-flex justify-content-end">
                <Link to="/invoice/create" className="text-decoration-none">
                    <Button>Add Invoice</Button>
                </Link>
            </div>

            {/* Date Filter */}
            <div className="date-filter">
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
                {/* <Button
                    className={`btn-create-yellow-border ${dateFilter === "this_month" }`}
                    onClick={() => setDateFilter("this_month")}
                >
                    This Month
                </Button>
                <Button
                    className={`btn-create-yellow ms-3 ${dateFilter === "last_3_months"}`}
                    onClick={() => setDateFilter("last_3_months")}
                >
                    Last 3 Months
                </Button> */}
            </div>

            {/* Search Bar */}
            <ContentContainer title="Student Fees Collection List">
                {/* Search by student name */}
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    placeholder="Search student by name"
                />

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
