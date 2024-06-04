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
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axiosClient";

export default function Students() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getStudents();
    }, []);

    const onDeleteClick = (student) => {
        if (!window.confirm("Are you sure you want to delete this student?")) {
            return;
        }
        axiosClient.delete(`/students/${student.id}`).then(() => {
            getStudents();
        });
    };

    const getStudents = () => {
        setLoading(true);
        axiosClient
            .get("/students")
            .then(({ data }) => {
                setLoading(false);
                setStudents(data.data);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    return (
        <>
            <div className="container">
                <div className="d-flex justify-content-between align-items-center">
                    <h1>Student List</h1>
                    <Link className="btn btn-primary" to="/students/new">
                        Add new student
                    </Link>
                </div>
                <div className="card mt-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Student Name</th>
                                <th>Study Level</th>
                                <th>Subject</th>
                                <th>Registration Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        Loading...
                                    </td>
                                </tr>
                            ) : (
                                students.map((s) => (
                                    <tr key={s.id}>
                                        <td>{s.id}</td>
                                        <td>{s.name}</td>
                                        {/* <td>{s.study_level}</td>
                                        <td>{s.subject}</td> */}
                                        <td>{s?.study_level ? s.study_level : 'Not Yet Enrolled'}</td>
                                        <td>{s?.subject ? s.subject : 'Not Yet Enrolled'}</td>
                                        <td>{s.registration_date}</td>
                                        <td>
                                            <Link
                                                className="btn btn-primary"
                                                to={"/students/" + s.id }
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                className="btn btn-danger ms-2"
                                                onClick={() => onDeleteClick(s)}
                                            >
                                                Delete
                                            </button>
                                            <Link
                                                className="btn btn-light ms-2"
                                                to={"/students/" + s.id + "/profile"}
                                            >
                                                <i class="bi bi-person-lines-fill"></i> Profile
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
