// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axiosClient from "../axiosClient";

// export default function StudentProfile() {
//     const { id } = useParams();
//     const [student, setStudent] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [enrollmentSubject, setEnrollmentSubject] = useState({
//         id: null,
//         study_level: '',
//         subject: '',
//     });

//     const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

//     const handleOpenModal = () => {
//         setIsModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//     };

//     useEffect(() => {
//         setLoading(true);
//         axiosClient.get(`/students/${id}`)
//             .then(({ data }) => {
//                 setStudent(data);
//                 setLoading(false);
//             })
//             .catch(() => {
//                 setLoading(false);
//             });
//     }, [id]);

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     if (!student) {
//         return <div>Student not found</div>;
//     }

//     return (
//         <div className="container">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//                 <h1>Student Profile</h1>
//                 <Link className="btn btn-primary" to="/students">Back to Student List</Link>
//             </div>

//             <div className="card mt-3">
//                 <div className="card-body">
//                     <h5 className="card-title">{student.name}</h5>
//                     <p className="card-text"><strong>ID:</strong> {student.id}</p>
//                     <p className="card-text"><strong>Gender:</strong> {student.gender}</p>
//                     <p className="card-text"><strong>Birth Date:</strong> {student.birth_date}</p>
//                     <p className="card-text"><strong>Age:</strong> {student.age}</p>
//                     <p className="card-text"><strong>Nationality:</strong> {student.nationality}</p>
//                     <p className="card-text"><strong>Address:</strong> {student.address}</p>
//                     <p className="card-text"><strong>Postal Code:</strong> {student.postal_code}</p>
//                     <p className="card-text"><strong>Study Level:</strong> {enrollmentSubject?.study_level ? enrollmentSubject.study_level : "Not Yet Enrolled"}</p>
//                     <p className="card-text"><strong>Subject:</strong> {enrollmentSubject?.subject ? enrollmentSubject.subject : "Not Yet Enrolled"}</p>
//                     <p className="card-text"><strong>Registration Date:</strong> {student.registration_date}</p>

//                 </div>
//             </div>

//             <div className="card-header d-flex justify-content-between align-items-center mt-3">
//                 <h3>Add Subject Enrollment</h3>
//                 <button
//                     type="button"
//                     className="btn btn-outline-secondary"
//                     data-bs-toggle="modal"
//                     data-bs-target="#createSubjectModal"
//                     onClick={handleOpenModal} // Add onClick handler
//                 >
//                     Add
//                 </button>


//                 {/* Bootstrap Modal */}
//                 <div
//                     id="createSubjectModal"
//                     className="modal fade"
//                     tabindex="-1"
//                     data-bs-backdrop="static"
//                     data-bs-keyboard="false"
//                 >
//                     <div className="modal-dialog">
//                         <div className="modal-content">

//                             <div className="modal-header">
//                                 <h5 className="modal-title">Subject 1</h5>
//                                 <button
//                                     type="button"
//                                     className="btn-close"
//                                     data-bs-dismiss="modal"
//                                 ></button>
//                             </div>

//                             <div className="modal-body">
//                                 <form method="post" >
//                                     <div className="form-group mb-3">
//                                         <label htmlFor="subject" className="form-label">
//                                             Subject
//                                         </label>
//                                         <select
//                                             id="subject"
//                                             className="form-select"
//                                             value={enrollmentSubject.subject}
//                                             onChange={ev => setEnrollmentSubject(ev.target.value)}

//                                         >
//                                             <option value="">
//                                                 Select subject
//                                             </option>
//                                             <option value="Math">
//                                                 Math
//                                             </option>
//                                             <option value="English">English</option>
//                                         </select>
//                                     </div>


//                                     <div className="form-group mb-3">
//                                         <label htmlFor="studyLevel" className="form-label">
//                                             Study level
//                                         </label>
//                                         <select
//                                             id="studyLevel"
//                                             className="form-select"
//                                             value={enrollmentSubject.study_level}
//                                             onChange={ev => setEnrollmentSubject(ev.target.value)}
//                                         >
//                                             <option value="">Select study level</option>
//                                             <option value="Pre & Lower Primary">Pre & Lower Primary</option>
//                                             <option value="Upper Primary">Upper Primary</option>
//                                         </select>
//                                     </div>

//                                     <div className="form-group mb-3">
//                                         <label htmlFor="studyLevel" className="form-label">
//                                             Class time
//                                         </label>
//                                         <select
//                                             id="studyLevel"
//                                             className="form-select"
//                                             value={enrollmentSubject.study_level}
//                                             onChange={ev => setEnrollmentSubject(ev.target.value)}
//                                         >
//                                             <option value="">Select class time</option>
//                                             <option value="10:00 - 11:00">10:00 - 11:00</option>
//                                             <option value="11:00 - 12:00">11:00 - 12:00</option>
//                                             <option value="13:00 - 14:00">13:00 - 14:00</option>
//                                         </select>
//                                     </div>
                
//                                     <button
//                                         type="submit"
//                                         className="btn btn-primary"
//                                     >
//                                         Submit
//                                     </button>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//             </div>

            

//             <div className="card mt-3">
//                 <div className="card-body">
//                 <table>
//   <thead>
//     <tr>
//       <th>Subject</th>
//       <th>Study Level</th>
//     </tr>
//   </thead>
//   <tbody>
//     {/* Conditionally render a table row for each enrollment */}
//     {student.enrollments?.map((enrollment) => (
//       <tr key={enrollment.id}>
//         <td>{enrollment.subject}</td>
//         <td>{enrollment.study_level}</td>
//       </tr>
//     ))}
//   </tbody>
// </table>

//                 </div>

//             </div>

//         </div>
//     );
// }

// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axiosClient from "../axiosClient";

// export default function StudentProfile() {
//     const { id } = useParams();
//     const [student, setStudent] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [enrollmentSubject, setEnrollmentSubject] = useState({
//         study_level: '',
//         subject: '',
//     });
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const handleOpenModal = () => {
//         setIsModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setEnrollmentSubject({
//             ...enrollmentSubject,
//             [name]: value,
//         });
//     };

//     const handleFormSubmit = (e) => {
//         e.preventDefault();
//         axiosClient.post(`/students/${id}/enrollments`, enrollmentSubject)
//             .then(({ data }) => {
//                 setStudent(prevState => ({
//                     ...prevState,
//                     enrollments: prevState.enrollments ? [...prevState.enrollments, data] : [data],
//                 }));
//                 setEnrollmentSubject({ study_level: '', subject: '' });
//                 handleCloseModal();
//             })
//             .catch((error) => {
//                 console.error("There was an error adding the enrollment!", error);
//             });
//     };

//     useEffect(() => {
//         setLoading(true);
//         axiosClient.get(`/students/${id}`)
//             .then(({ data }) => {
//                 setStudent(data);
//                 setLoading(false);
//             })
//             .catch(() => {
//                 setLoading(false);
//             });
//     }, [id]);

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     if (!student) {
//         return <div>Student not found</div>;
//     }

//     return (
//         <div className="container">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//                 <h1>Student Profile</h1>
//                 <Link className="btn btn-primary" to="/students">Back to Student List</Link>
//             </div>

//             <div className="card mt-3">
//                 <div className="card-body">
//                     <h5 className="card-title">{student.name}</h5>
//                     <p className="card-text"><strong>ID:</strong> {student.id}</p>
//                     <p className="card-text"><strong>Gender:</strong> {student.gender}</p>
//                     <p className="card-text"><strong>Birth Date:</strong> {student.birth_date}</p>
//                     <p className="card-text"><strong>Age:</strong> {student.age}</p>
//                     <p className="card-text"><strong>Nationality:</strong> {student.nationality}</p>
//                     <p className="card-text"><strong>Address:</strong> {student.address}</p>
//                     <p className="card-text"><strong>Postal Code:</strong> {student.postal_code}</p>
//                     <p className="card-text"><strong>Registration Date:</strong> {student.registration_date}</p>
//                 </div>
//             </div>

//             <div className="card-header d-flex justify-content-between align-items-center mt-3">
//                 <h3>Add Subject Enrollment</h3>
//                 <button
//                     type="button"
//                     className="btn btn-outline-secondary"
//                     data-bs-toggle="modal"
//                     data-bs-target="#createSubjectModal"
//                     onClick={handleOpenModal}
//                 >
//                     Add
//                 </button>

//                 <div
//                     id="createSubjectModal"
//                     className={`modal fade ${isModalOpen ? 'show' : ''}`}
//                     style={{ display: isModalOpen ? 'block' : 'none' }}
//                     tabIndex="-1"
//                     data-bs-backdrop="static"
//                     data-bs-keyboard="false"
//                     aria-hidden={!isModalOpen}
//                 >
//                     <div className="modal-dialog">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h5 className="modal-title">Subject Enrollment</h5>
//                                 <button
//                                     type="button"
//                                     className="btn-close"
//                                     data-bs-dismiss="modal"
//                                     aria-label="Close"
//                                     onClick={handleCloseModal}
//                                 ></button>
//                             </div>
//                             <div className="modal-body">
//                                 <form onSubmit={handleFormSubmit}>
//                                     <div className="form-group mb-3">
//                                         <label htmlFor="subject" className="form-label">Subject</label>
//                                         <select
//                                             id="subject"
//                                             name="subject"
//                                             className="form-select"
//                                             value={enrollmentSubject.subject}
//                                             onChange={handleInputChange}
//                                         >
//                                             <option value="">Select subject</option>
//                                             <option value="Math">Math</option>
//                                             <option value="English">English</option>
//                                         </select>
//                                     </div>

//                                     <div className="form-group mb-3">
//                                         <label htmlFor="study_level" className="form-label">Study Level</label>
//                                         <select
//                                             id="study_level"
//                                             name="study_level"
//                                             className="form-select"
//                                             value={enrollmentSubject.study_level}
//                                             onChange={handleInputChange}
//                                         >
//                                             <option value="">Select study level</option>
//                                             <option value="Pre & Lower Primary">Pre & Lower Primary</option>
//                                             <option value="Upper Primary">Upper Primary</option>
//                                         </select>
//                                     </div>

//                                     <button type="submit" className="btn btn-primary">Submit</button>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="card mt-3">
//                 <div className="card-body">
//                     <table className="table">
//                         <thead>
//                             <tr>
//                                 <th>Subject</th>
//                                 <th>Study Level</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {student.enrollments?.map((enrollment) => (
//                                 <tr key={enrollment.id}>
//                                     <td>{enrollment.subject}</td>
//                                     <td>{enrollment.study_level}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// }

// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axiosClient from "../axiosClient";

// export default function StudentProfile() {
//     const { id } = useParams();
//     const [student, setStudent] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [enrollmentSubject, setEnrollmentSubject] = useState({
//         study_level: '',
//         subject: '',
//     });
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const handleOpenModal = () => {
//         setIsModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setEnrollmentSubject({
//             ...enrollmentSubject,
//             [name]: value,
//         });
//     };

//     const handleFormSubmit = (e) => {
//         e.preventDefault();
//         axiosClient.post(`/students/${id}/enrollments`, enrollmentSubject)
//             .then(({ data }) => {
//                 setStudent(prevState => ({
//                     ...prevState,
//                     enrollments: prevState.enrollments ? [...prevState.enrollments, data] : [data],
//                 }));
//                 setEnrollmentSubject({ study_level: '', subject: '' });
//                 handleCloseModal();
//             })
//             .catch((error) => {
//                 console.error("There was an error adding the enrollment!", error);
//             });
//     };

//     useEffect(() => {
//         setLoading(true);
//         axiosClient.get(`/students/${id}`)
//             .then(({ data }) => {
//                 setStudent(data);
//                 setLoading(false);
//             })
//             .catch(() => {
//                 setLoading(false);
//             });
//     }, [id]);

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     if (!student) {
//         return <div>Student not found</div>;
//     }

//     return (
//         <div className="container">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//                 <h1>Student Profile</h1>
//                 <Link className="btn btn-primary" to="/students">Back to Student List</Link>
//             </div>

//             <div className="card mt-3">
//                 <div className="card-body">
//                     <h5 className="card-title">{student.name}</h5>
//                     <p className="card-text"><strong>ID:</strong> {student.id}</p>
//                     <p className="card-text"><strong>Gender:</strong> {student.gender}</p>
//                     <p className="card-text"><strong>Birth Date:</strong> {student.birth_date}</p>
//                     <p className="card-text"><strong>Age:</strong> {student.age}</p>
//                     <p className="card-text"><strong>Nationality:</strong> {student.nationality}</p>
//                     <p className="card-text"><strong>Address:</strong> {student.address}</p>
//                     <p className="card-text"><strong>Postal Code:</strong> {student.postal_code}</p>
//                     <p className="card-text"><strong>Registration Date:</strong> {student.registration_date}</p>
//                 </div>
//             </div>

//             <div className="card-header d-flex justify-content-between align-items-center mt-3">
//                 <h3>Add Subject Enrollment</h3>
//                 <button
//                     type="button"
//                     className="btn btn-outline-secondary"
//                     data-bs-toggle="modal"
//                     data-bs-target="#createSubjectModal"
//                     onClick={handleOpenModal}
//                 >
//                     Add
//                 </button>

//                 <div
//                     id="createSubjectModal"
//                     className={`modal fade ${isModalOpen ? 'show' : ''}`}
//                     style={{ display: isModalOpen ? 'block' : 'none' }}
//                     tabIndex="-1"
//                     data-bs-backdrop="static"
//                     data-bs-keyboard="false"
//                     aria-hidden={!isModalOpen}
//                 >
//                     <div className="modal-dialog">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h5 className="modal-title">Subject Enrollment</h5>
//                                 <button
//                                     type="button"
//                                     className="btn-close"
//                                     data-bs-dismiss="modal"
//                                     aria-label="Close"
//                                     onClick={handleCloseModal}
//                                 ></button>
//                             </div>
//                             <div className="modal-body">
//                                 <form onSubmit={handleFormSubmit}>
//                                     <div className="form-group mb-3">
//                                         <label htmlFor="subject" className="form-label">Subject</label>
//                                         <select
//                                             id="subject"
//                                             name="subject"
//                                             className="form-select"
//                                             value={enrollmentSubject.subject}
//                                             onChange={handleInputChange}
//                                         >
//                                             <option value="">Select subject</option>
//                                             <option value="Math">Math</option>
//                                             <option value="English">English</option>
//                                         </select>
//                                     </div>

//                                     <div className="form-group mb-3">
//                                         <label htmlFor="study_level" className="form-label">Study Level</label>
//                                         <select
//                                             id="study_level"
//                                             name="study_level"
//                                             className="form-select"
//                                             value={enrollmentSubject.study_level}
//                                             onChange={handleInputChange}
//                                         >
//                                             <option value="">Select study level</option>
//                                             <option value="Pre & Lower Primary">Pre & Lower Primary</option>
//                                             <option value="Upper Primary">Upper Primary</option>
//                                         </select>
//                                     </div>

//                                     <button type="submit" className="btn btn-primary">Submit</button>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="card mt-3">
//                 <div className="card-body">
//                     <table className="table">
//                         <thead>
//                             <tr>
//                                 <th>Subject</th>
//                                 <th>Study Level</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {student.enrollments?.map((enrollment) => (
//                                 <tr key={enrollment.id}>
//                                     <td>{enrollment.subject}</td>
//                                     <td>{enrollment.study_level}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// }

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../axiosClient";

export default function StudentProfile() {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [enrollmentSubject, setEnrollmentSubject] = useState({
        study_level: '',
        subject: '',
        class_time: '',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEnrollmentSubject({
            ...enrollmentSubject,
            [name]: value,
        });
    };

 // Function to check if a given subject and class time combination already exists
const isDuplicateEnrollment = (subject, classTime, enrollments) => {
    // Check if any enrollment exists for the selected class time
    const enrollmentExistsForClassTime = enrollments.some(enrollment => enrollment.class_time === classTime);

    // Check if the selected subject and class time combination already exists
    const enrollmentExistsForSubjectAndClassTime = enrollments.some(enrollment => enrollment.subject === subject && enrollment.class_time === classTime);

    // Return true if either condition is met
    return enrollmentExistsForClassTime || enrollmentExistsForSubjectAndClassTime;
};


// Modify the handleFormSubmit function to include the duplicate check
const handleFormSubmit = (e) => {
    e.preventDefault();

    // Check if the selected subject and class time combination already exists
    if (isDuplicateEnrollment(enrollmentSubject.subject, enrollmentSubject.class_time, student.enrollments)) {
        alert("This subject and class time combination already exists!");
        return; // Prevent further execution
    }

    axiosClient.post(`/students/${id}/enrollments`, enrollmentSubject)
        .then(({ data }) => {
            setStudent(prevState => ({
                ...prevState,
                enrollments: prevState.enrollments ? [...prevState.enrollments, data] : [data],
            }));
            setEnrollmentSubject({ study_level: '', subject: '', class_time: '' });
            handleCloseModal();
        })
        .catch((error) => {
            console.error("There was an error adding the enrollment!", error);
        });
};

    useEffect(() => {
        setLoading(true);
        axiosClient.get(`/students/${id}`)
            .then(({ data }) => {
                setStudent(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!student) {
        return <div>Student not found</div>;
    }

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Student Profile</h1>
                <Link className="btn btn-primary" to="/students">Back to Student List</Link>
            </div>

            <div className="card mt-3">
                <div className="card-body">
                    <h5 className="card-title">{student.name}</h5>
                    <p className="card-text"><strong>ID:</strong> {student.id}</p>
                    <p className="card-text"><strong>Gender:</strong> {student.gender}</p>
                    <p className="card-text"><strong>Birth Date:</strong> {student.birth_date}</p>
                    <p className="card-text"><strong>Age:</strong> {student.age}</p>
                    <p className="card-text"><strong>Nationality:</strong> {student.nationality}</p>
                    <p className="card-text"><strong>Address:</strong> {student.address}</p>
                    <p className="card-text"><strong>Postal Code:</strong> {student.postal_code}</p>
                    <p className="card-text"><strong>Registration Date:</strong> {student.registration_date}</p>
                </div>
            </div>

            <div className="card-header d-flex justify-content-between align-items-center mt-3">
                <h3>Add Subject Enrollment</h3>
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    data-bs-toggle="modal"
                    data-bs-target="#createSubjectModal"
                    onClick={handleOpenModal}
                >
                    Add
                </button>

                <div
                    id="createSubjectModal"
                    className={`modal fade ${isModalOpen ? 'show' : ''}`}
                    style={{ display: isModalOpen ? 'block' : 'none' }}
                    tabIndex="-1"
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                    aria-hidden={!isModalOpen}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Subject Enrollment</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={handleCloseModal}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleFormSubmit}>
                                    <div className="form-group mb-3">
                                        <label htmlFor="subject" className="form-label">Subject</label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            className="form-select"
                                            value={enrollmentSubject.subject}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select subject</option>
                                            <option value="Math">Math</option>
                                            <option value="English">English</option>
                                        </select>
                                    </div>

                                    <div className="form-group mb-3">
                                        <label htmlFor="study_level" className="form-label">Study Level</label>
                                        <select
                                            id="study_level"
                                            name="study_level"
                                            className="form-select"
                                            value={enrollmentSubject.study_level}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select study level</option>
                                            <option value="Pre & Lower Primary">Pre & Lower Primary</option>
                                            <option value="Upper Primary">Upper Primary</option>
                                        </select>
                                    </div>

                                    <div className="form-group mb-3">
                                        <label htmlFor="class_time" className="form-label">Class Time</label>
                                        <select
                                            id="class_time"
                                            name="class_time"
                                            className="form-select"
                                            value={enrollmentSubject.class_time}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select class time</option>
                                            <option value="10:00 - 11:00">10:00 - 11:00</option>
                                            <option value="11:00 - 12:00">11:00 - 12:00</option>
                                            <option value="13:00 - 14:00">13:00 - 14:00</option>
                                        </select>
                                    </div>

                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card mt-3">
                <div className="card-body">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Study Level</th>
                                <th>Class Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {student.enrollments?.map((enrollment) => (
                                <tr key={enrollment.id}>
                                    <td>{enrollment.subject}</td>
                                    <td>{enrollment.study_level}</td>
                                    <td>{enrollment.class_time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
