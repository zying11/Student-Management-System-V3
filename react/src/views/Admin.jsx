import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axiosClient";
import Button from "../components/Button/Button";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import { Table } from "../components/Table/Table";

export default function Admin() {
    const [adminData, setAdminData] = useState({
        admins: [],
        loading: true,
    });

    const [error, setError] = useState("");

    // Fetch admin data
    useEffect(() => {
        async function fetchAdmins() {
            try {
                // Fetch data from /admins endpoint
                const res = await axiosClient.get("/admins"); 
                setAdminData({
                    admins: res.data.data,
                    loading: false,
                });
            } catch (error) {
                console.error("Error fetching admins:", error);
                setAdminData({
                    admins: [],
                    loading: false,
                });
                setError("Error fetching admin data. Please try again later.");
            }
        }

        // Call fetchAdmins function
        fetchAdmins();
    }, []);

    // Handle deletion of an admin
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this admin?")) {
            return;
        }
        try {
            // Delete admin with the given ID
            await axiosClient.delete(`/admins/${id}`);
            // Update state to remove the deleted admin
            setAdminData((prevState) => ({
                ...prevState,
                admins: prevState.admins.filter((admin) => admin.id !== id),
            }));
        } catch (error) {
            console.error("Error deleting admin:", error);
            setError("Error deleting admin. Please try again later.");
        }
    };

    const tableHeader = ["ID", "Admin Name", "Email", "Joining Date", "Actions"];

    const tableData = adminData.loading
        ? [
            [
                <td key="loading" colSpan="5" className="text-center">
                    Loading...
                </td>,
            ],
        ]
        : adminData.admins.map((admin) => [
            admin.id || "-",
            admin.name || "-",
            admin.email || "-",
            admin.joining_date || "-",
            <div className="actions">
                {/*Edit action*/}
                <Link to={`/admin/edit/${admin.id}`} className="text-decoration-none">
                    <img
                        className="me-2"
                        src="http://localhost:8000/icon/edit.png"
                        alt="Edit" />
                </Link>
                {/*Delete action*/}
                <img
                    className="me-2"
                    src="http://localhost:8000/icon/delete.png"
                    alt="Delete"
                    onClick={() => handleDelete(admin.id)}
                    style={{ cursor: "pointer" }}
                />
                {/*Profile action*/}
                <img
                    src="http://localhost:8000/icon/profile.png"
                    alt="Profile" />
            </div>,
        ]);

    return (
        <>
            <div className="page-title">Admins</div>
            <div className="d-flex justify-content-end">
                <Link to="/admin/create" className="text-decoration-none">
                    <Button>Add Admin</Button>
                </Link>
            </div>
            <ContentContainer title="Admin List">
                {error && <div className="alert alert-danger">{error}</div>}
                <Table header={tableHeader} data={tableData} itemsPerPage={10} />
            </ContentContainer>
        </>
    );
}
