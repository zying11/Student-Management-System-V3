// import { useEffect } from "react";
// import { useState } from "react";
// import { Link } from "react-router-dom";
// import axiosClient from "../axiosClient";

// export default function Students() {
//     const [students, setStudents] = useState([]);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         getStudents();
//     }, []);

//     const onDeleteClick = (student) => {
//         if (!window.confirm("Are you sure you want to delete this student?")) {
//             return;
//         }
//         axiosClient.delete(`/students/${student.id}`).then(() => {
//             getStudents();
//         });
//     };

//     const getStudents = () => {
//         setLoading(true);
//         axiosClient
//             .get("/students")
//             .then(({ data }) => {
//                 setLoading(false);
//                 setStudents(data.data);
//             })
//             .catch(() => {
//                 setLoading(false);
//             });
//     };

//     return (
//         <>
//             <div className="container">
//                 <div className="d-flex justify-content-between align-items-center">
//                     <h1>Student List</h1>
//                     <Link className="btn btn-primary" to="/students/new">
//                         Add new student
//                     </Link>
//                 </div>
//                 <div className="card mt-3">
//                     <table className="table">
//                         <thead>
//                             <tr>
//                                 <th>ID</th>
//                                 <th>Student Name</th>
//                                 {/* <th>Gender</th>
//                                 <th>Birth Date</th>
//                                 <th>Age</th>
//                                 <th>Nationality</th>
//                                 <th>Address</th>
//                                 <th>Postal Code</th> */}
//                                 <th>Study Level</th>
//                                 <th>Subject</th>
//                                 <th>Registration Date</th>
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
//                                 students.map((s) => (
//                                     <tr key={s.id}>
//                                         <td>{s.id}</td>
//                                         <td>{s.name}</td>
//                                         {/* <td>{s.gender}</td>
//                                         <td>{s.birth_date}</td>
//                                         <td>{s.age}</td>
//                                         <td>{s.nationality}</td>
//                                         <td>{s.address}</td>
//                                         <td>{s.postal_code}</td> */}
//                                         <td>{s.study_level}</td>
//                                         <td>{s.subject}</td>
//                                         <td>{s.registration_date}</td>
//                                         <td>
//                                             <Link
//                                                 className="btn btn-primary"
//                                                 to={"/students/" + s.id}
//                                             >
//                                                 Edit
//                                             </Link>
//                                             <button
//                                                 className="btn btn-danger ms-2"
//                                                 onClick={() => onDeleteClick(s)}
//                                             >
//                                                 Delete
//                                             </button>
//                                             <Link

//                                                 className="icon btn btn-light"
//                                                 // to={"/students/" + s.id}
//                                                   to={"/students/profile"}
//                                             >
//                                                 <i class="bi bi-person-lines-fill"></i> Profile
//                                             </Link>
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


// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axiosClient from "../axiosClient";

// export default function Students() {
//     const [students, setStudents] = useState([]);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         getStudents();
//     }, []);

//     const onDeleteClick = (student) => {
//         if (!window.confirm("Are you sure you want to delete this student?")) {
//             return;
//         }
//         axiosClient.delete(`/students/${student.id}`).then(() => {
//             getStudents();
//         });
//     };

//     const getStudents = () => {
//         setLoading(true);
//         axiosClient
//             .get("/students")
//             .then(({ data }) => {
//                 setLoading(false);
//                 setStudents(data.data);
//             })
//             .catch(() => {
//                 setLoading(false);
//             });
//     };

//     return (
//         <>
//             <div className="container">
//                 <div className="d-flex justify-content-between align-items-center">
//                     <h1>Student List</h1>
//                     <Link className="btn btn-primary" to="/students/new">
//                         Add new student
//                     </Link>
//                 </div>
//                 <div className="card mt-3">
//                     <table className="table">
//                         <thead>
//                             <tr>
//                                 <th>ID</th>
//                                 <th>Student Name</th>
//                                 <th>Study Level</th>
//                                 <th>Subject</th>
//                                 <th>Registration Date</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {loading ? (
//                                 <tr>
//                                     <td colSpan="6" className="text-center">
//                                         Loading...
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 students.map((s) => (
//                                     <tr key={s.id}>
//                                         <td>{s.id}</td>
//                                         <td>{s.name}</td>
//                                         {/* <td>{s.study_level}</td>
//                                         <td>{s.subject}</td> */}
//                                         <td>{s?.study_level ? s.study_level : 'Not Yet Enrolled'}</td>
//                                         <td>{s?.subject ? s.subject : 'Not Yet Enrolled'}</td>
//                                         <td>{s.registration_date}</td>
//                                         <td>
//                                             <Link
//                                                 className="btn btn-primary"
//                                                 to={"/students/" + s.id }
//                                             >
//                                                 Edit
//                                             </Link>
//                                             <button
//                                                 className="btn btn-danger ms-2"
//                                                 onClick={() => onDeleteClick(s)}
//                                             >
//                                                 Delete
//                                             </button>
//                                             <Link
//                                                 className="btn btn-light ms-2"
//                                                 to={"/students/" + s.id + "/profile"}
//                                             >
//                                                 <i class="bi bi-person-lines-fill"></i> Profile
//                                             </Link>
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

export default function Students() {
    const [studentData, setStudentData] = useState({
        students: [],
        loading: true,
    });
    const [subjects, setSubjects] = useState([]);

    const [error, setError] = useState("");

    // Fetch students data
    useEffect(() => {
        async function fetchStudents() {
            try {
                // Fetch data from /students endpoint
                const res = await axiosClient.get("/students");
                setStudentData({
                    students: res.data.data,
                    loading: false,
                });
            } catch (error) {
                console.error("Error fetching students:", error);
                setStudentData({
                    students: [],
                    loading: false,
                });
                setError("Error fetching student data. Please try again later.");
            }
        }

        async function fetchSubjects() {
            try {
                const res = await axiosClient.get("/subjects"); // Adjust the endpoint as needed
                setSubjects(res.data.subjects); // Use the correct path to subjects
            } catch (error) {
                console.error("Error fetching subjects:", error);
                setError("Error fetching subject data. Please try again later.");
            }
        }

        fetchSubjects();

        // Call fetchStudents function
        fetchStudents();
    }, []);

    const getSubjectDetails = (subjectId) => {
        const subject = subjects.find(sub => sub.id === subjectId);
        return subject ? {
            name: subject.subject_name,
            level: subject.level_name || '-'
        } : { name: '-', level: '-' };
    };

    // Handle deletion of a student
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this student?")) {
            return;
        }
        try {
            // Delete student with the given ID
            await axiosClient.delete(`/students/${id}`);
            // Update state to remove the deleted student
            setStudentData((prevState) => ({
                ...prevState,
                students: prevState.students.filter((student) => student.id !== id),
            }));
        } catch (error) {
            console.error("Error deleting student:", error);
            setError("Error deleting student. Please try again later.");
        }
    };

    const tableHeader = ["ID", "Student Name", "Study Level", "Subject", "Registration Date", "Actions"];

    const tableData = studentData.loading
        ? [
            [
                <td key="loading" colSpan="6" className="text-center">
                    Loading...
                </td>,
            ],
        ]
        : studentData.students.map((student) => [
            student.id || "-",
            student.name || "-",
            // student.study_level || "-",
            // student.subject || "-",
            student.enrollments.length > 0 ? getSubjectDetails(student.enrollments[0].subject_id).level : "-",
            student.enrollments.length > 0 ? getSubjectDetails(student.enrollments[0].subject_id).name : "-",
            student.registration_date || "-",
            <div className="actions">
                {/*Edit action*/}
                <Link to={`/student/edit/${student.id}`} className="text-decoration-none">
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
                    onClick={() => handleDelete(student.id)}
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
            <div className="page-title">Students</div>
            <div className="d-flex justify-content-end">
                <Link to="/student/create" className="text-decoration-none">
                    <Button>Add Student</Button>
                </Link>
            </div>
            <ContentContainer title="Student List">
                {error && <div className="alert alert-danger">{error}</div>}
                <Table header={tableHeader} data={tableData} />
            </ContentContainer>
        </>
    );
}


