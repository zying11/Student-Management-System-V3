// import { useEffect } from "react";
// import { useState } from "react";
// import { Link } from "react-router-dom";
// import axiosClient from "../axiosClient";

// export default function Users() {
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         getUsers();
//     }, []);

//     const onDeleteClick = (user) => {
//         if (!window.confirm("Are you sure you want to delete this user?")) {
//             return;
//         }
//         axiosClient.delete(`/users/${user.id}`).then(() => {
//             getUsers();
//         });
//     };

//     const getUsers = () => {
//         setLoading(true);
//         axiosClient
//             .get("/users")
//             .then(({ data }) => {
//                 setLoading(false);
//                 setUsers(data.data);
//             })
//             .catch(() => {
//                 setLoading(false);
//             });
//     };

//     return (
//         <>
//             <div className="container">
//                 <div className="d-flex justify-content-between align-items-center">
//                     <h1>Users</h1>
//                     <Link className="btn btn-primary" to="/users/new">
//                         Add new
//                     </Link>
//                 </div>
//                 <div className="card mt-3">
//                     <table className="table">
//                         <thead>
//                             <tr>
//                                 <th>ID</th>
//                                 <th>Name</th>
//                                 <th>Email</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {loading ? (
//                                 <tr>
//                                     <td colSpan="4" className="text-center">
//                                         Loading...
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 users.map((u) => (
//                                     <tr key={u.id}>
//                                         <td>{u.id}</td>
//                                         <td>{u.name}</td>
//                                         <td>{u.email}</td>
//                                         <td>
//                                             <Link
//                                                 className="btn btn-primary"
//                                                 to={"/users/" + u.id}
//                                             >
//                                                 Edit
//                                             </Link>
//                                             <button
//                                                 className="btn btn-danger ms-2"
//                                                 onClick={() => onDeleteClick(u)}
//                                             >
//                                                 Delete
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </>
//     );
// }

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axiosClient";
import Button from "../components/Button/Button";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import { Table } from "../components/Table/Table";

export default function Users() {
    // State for storing users data and loading state
    const [usersData, setUsersData] = useState({
        users: [],
        loading: true,
    });

    // Error handling state
    const [error, setError] = useState("");

    // Fetch users data on component mount
    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await axiosClient.get("/users");
                setUsersData({
                    users: res.data.data,
                    loading: false,
                });
            } catch (error) {
                console.error("Error fetching users:", error);
                setUsersData({
                    users: [],
                    loading: false,
                });
                setError("Error fetching user data. Please try again later.");
            }
        }

        fetchUsers();
    }, []);

    // Delete user function
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return;
        }
        try {
            await axiosClient.delete(`/users/${id}`);
            setUsersData((prevState) => ({
                ...prevState,
                users: prevState.users.filter((user) => user.id !== id),
            }));
        } catch (error) {
            console.error("Error deleting user:", error);
            setError("Error deleting user. Please try again later.");
        }
    };

    // Table headers
    const tableHeader = ["ID", "Name", "Email", "Actions"];

    // Table data construction
    const tableData = usersData.loading
        ? [
            [
                <td key="loading" colSpan="4" className="text-center">
                    Loading...
                </td>,
            ],
        ]
        : usersData.users.map((user) => [
            user.id,
            user.name,
            user.email,
            <div className="actions" key={`actions-${user.id}`}>
                <Link
                    className="btn btn-primary me-2"
                    to={`/users/${user.id}`}
                >
                    Edit
                </Link>
                <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(user.id)}
                >
                    Delete
                </button>
            </div>,
        ]);

    return (
        <>
            <div className="page-title">Users</div>
            <div className="d-flex justify-content-end">
                <Link to="/users/new" className="text-decoration-none">
                    <Button>Add new</Button>
                </Link>
            </div>
            <ContentContainer title="User List">
                {error && <div className="alert alert-danger">{error}</div>}
                <Table header={tableHeader} data={tableData}></Table>
            </ContentContainer>
        </>
    );
}

