// import { useEffect, useState, useRef } from "react";
// import { useParams, Link } from "react-router-dom";
// import axiosClient from "../axiosClient";
// import Button from "../components/Button/Button";
// import { ContentContainer } from "../components/ContentContainer/ContentContainer";
// import { Table } from "../components/Table/Table";
// import Spinner from "react-bootstrap/Spinner";

// export default function StudentProfileView() {
//     const { id } = useParams();

//     const [studentData, setStudentData] = useState({
//         student: {}, 
//         loading: true,
//     });

//     // Days of the week
//     const daysOfWeek = [
//         "Sunday",
//         "Monday",
//         "Tuesday",
//         "Wednesday",
//         "Thursday",
//         "Friday",
//         "Saturday",
//     ];

//     const [error, setError] = useState("");

//     const [profileImage, setProfileImage] = useState(
//         "http://localhost:8000/images/student-profile.jpg" // Default image URL
//     );

//     const fileInputRef = useRef(null);

//     // Fetch student data
//     useEffect(() => {
//         async function fetchStudent() {

//             try {
//                 const res = await axiosClient.get(`/students/${id}`);
//                 setStudentData({
//                     student: res.data, // Assuming res.data is the student object
//                     loading: false,
//                 });
//             } catch (error) {
//                 console.error("Error fetching student:", error);
//                 setStudentData({
//                     student: {},
//                     loading: false,
//                 });
//                 setError(
//                     "Error fetching student data. Please try again later."
//                 );
//             }
//         }

//         fetchStudent();
//     }, [id]);

//     const handleProfileImageClick = () => {
//         fileInputRef.current.click();
//     };

//     const handleImageChange = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//               // Check file size or type if needed
//         if (file.size > 2 * 1024 * 1024) { // Limit: 2MB
//             setError("File size exceeds the limit of 2MB");
//             return;
//         }

//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setProfileImage(reader.result); // Set the new profile image
//             };
//             reader.readAsDataURL(file); // Read the image as a data URL
//         }
//     };

//     const student = studentData.student;

//     // Define the table headers for parent and subject enrollment
//     const tableHeaderParent = [
//         "ID",
//         "Parent Name",
//         "Relationship",
//         "Email",
//         "Mobile Number",
//     ];
//     const tableHeaderSubjectEnrollment = [
//         "ID",
//         "Subject",
//         "Study Level",
//         "Class Time",
//         "Teacher Name",
//     ];

//     // Prepare parent details and subject enrollment data
//     const tableDataParent = studentData.loading
//         ? [
//               [
//                   <td key="loading" colSpan="5" className="text-center">
//                       <Spinner animation="border" variant="primary" />
//                   </td>,
//               ],
//           ]
//         : student.parents.map((parent) => [
//               parent.id || "-",
//               parent.name || "-",
//               parent.relationship || "-",
//               parent.email || "-",
//               parent.phone_number || "-",
//           ]);

//     const tableDataSubjectEnrollment = studentData.loading
//         ? [
//               [
//                   <td key="loading" colSpan="5" className="text-center">
//                       <Spinner animation="border" variant="primary" />
//                   </td>,
//               ],
//           ]
//         : student.enrollments.map((subjectEnrollment) => [
//               subjectEnrollment.id || "-",
//               subjectEnrollment.subject.subject_name || "-",
//               subjectEnrollment.study_level.level_name || "-",
//               `${subjectEnrollment.lesson.start_time || "N/A"} - ${
//                   subjectEnrollment.lesson.end_time || "N/A"
//               }` +
//                   ` (${daysOfWeek[subjectEnrollment.lesson.day] || "N/A"}, ${
//                       subjectEnrollment.lesson.room || "N/A"
//                   })`,

//               subjectEnrollment.lesson.teacher_name || "-",
//           ]);

//           // Show loading spinner if loading is true
//     if (studentData.loading) {
//         return (
//             <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
//                 <Spinner animation="border" variant="primary" />
//             </div>
//         );
//     }

//     return (
//         <>
//             <div className="page-title">Student</div>

//             <div className="mt-3">
//                 <img
//                     src="http://localhost:8000/images/profile-bg.png"
//                     alt="Profile Background"
//                     style={{
//                         width: "100%",
//                         height: "auto",
//                         objectFit: "cover",
//                     }}
//                 />
//                 <ContentContainer
//                     className="student-detail-container"
//                     style={{ position: "relative" }}
//                 >

//                         <div className="d-flex flex-column">
//                             <div
//                                 style={{
//                                     position: "absolute",
//                                     top: "-150px", // Adjust as necessary
//                                     left: "7%",
//                                     transform: "translateX(-50%)",
//                                     zIndex: 1,
//                                 }}
//                             >
//                                 <img
//                                     src={profileImage}
//                                     alt="Profile"
//                                     onError={(e) => e.target.src = "http://localhost:8000/images/profile-pic.png"}
//                                     onClick={handleProfileImageClick}
//                                     style={{
//                                         width: "180px",
//                                         height: "180px",
//                                         borderRadius: "50%", // Circular profile picture
//                                         objectFit: "cover",
//                                         cursor: "pointer",
//                                         border: "5px solid white", // Make white border around the image
//                                     }}
//                                 />
//                                 <input
//                                     type="file"
//                                     accept="image/*"
//                                     onChange={handleImageChange}
//                                     ref={fileInputRef}
//                                     style={{ display: "none" }} // Hide the input
//                                 />
//                             </div>

//                             <div className="mt-5">
//                                 <h2>{studentData.student.name}</h2>
//                                 <p>
//                                     <small>Student</small>
//                                 </p>
//                             </div>

//                             <div className="row mt-5">
//                                 <div className="col-4">
//                                     <div className="d-flex">
//                                         <div className="me-3">
//                                             <img
//                                                 src="http://localhost:8000/icon/gender.png"
//                                                 alt="Gender"
//                                             />
//                                         </div>
//                                         <div>
//                                             <p>Gender:</p>
//                                             <p>{studentData.student.gender}</p>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="col-4">
//                                     <div className="d-flex">
//                                         <div className="me-3">
//                                             <img
//                                                 src="http://localhost:8000/icon/birthdate.png"
//                                                 alt="Birthdate"
//                                             />
//                                         </div>
//                                         <div>
//                                             <p>Birth Date:</p>
//                                             <p>
//                                                 {studentData.student.birth_date}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="col-4">
//                                     <div className="d-flex">
//                                         <div className="me-3">
//                                             <img
//                                                 src="http://localhost:8000/icon/birthdate.png"
//                                                 alt="Age"
//                                             />
//                                         </div>
//                                         <div>
//                                             <p>Age:</p>
//                                             <p>{studentData.student.age}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="row mt-5">
//                                 <div className="col-4">
//                                     <div className="d-flex">
//                                         <div className="me-3">
//                                             <img
//                                                 src="http://localhost:8000/icon/gender.png"
//                                                 alt="Nationality"
//                                             />
//                                         </div>
//                                         <div>
//                                             <p>Nationality:</p>
//                                             <p>
//                                                 {
//                                                     studentData.student
//                                                         .nationality
//                                                 }
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="col-4">
//                                     <div className="d-flex">
//                                         <div className="me-3">
//                                             <img
//                                                 src="http://localhost:8000/icon/address.png"
//                                                 alt="Address"
//                                             />
//                                         </div>
//                                         <div>
//                                             <p>Address:</p>
//                                             <p>{studentData.student.address}</p>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="col-4">
//                                     <div className="d-flex">
//                                         <div className="me-3">
//                                             <img
//                                                 src="http://localhost:8000/icon/address.png"
//                                                 alt="Postal Code"
//                                             />
//                                         </div>
//                                         <div>
//                                             <p>Postal Code:</p>
//                                             <p>
//                                                 {
//                                                     studentData.student
//                                                         .postal_code
//                                                 }
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="row mt-5">
//                                 <div className="col-12">
//                                     <div className="d-flex">
//                                         <div className="me-3">
//                                             <img
//                                                 src="http://localhost:8000/icon/admissiondate.png"
//                                                 alt="Registration Date"
//                                             />
//                                         </div>
//                                         <div>
//                                             <p>Registration Date:</p>
//                                             <p>
//                                                 {
//                                                     studentData.student
//                                                         .registration_date
//                                                 }
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                 </ContentContainer>
//             </div>

//             <ContentContainer title="Parent Details">
//                 {error && <div className="alert alert-danger">{error}</div>}
//                 <Table
//                     header={tableHeaderParent}
//                     data={tableDataParent}
//                     itemsPerPage={3}
//                 />
//             </ContentContainer>

//             <ContentContainer title="Subject Enrollment Details">
//                 {error && <div className="alert alert-danger">{error}</div>}
//                 <Table
//                     header={tableHeaderSubjectEnrollment}
//                     data={tableDataSubjectEnrollment}
//                     itemsPerPage={3}
//                 />
//             </ContentContainer>

//             <div className="d-flex justify-content-end mt-3">
//                 <div className="me-3">
//                     <Link
//                         to={`/student/edit/${id}`}
//                         className="text-decoration-none"
//                     >
//                         <Button
//                             className="btn-create-yellow"
//                         >
//                             Edit
//                         </Button>
//                     </Link>
//                 </div>
//                 <div>
//                     <Link to="/student" className="text-decoration-none">
//                         <Button>Back</Button>
//                     </Link>
//                 </div>
//             </div>
//         </>
//     );
// }

import ProfileView from "./ProfileView";

export default function StudentProfileView() {
    // Define the fields to display in the student's basic info
    const studentFields = [
        { label: "Gender", key: "gender", icon: "gender.png" },
        { label: "Birth Date", key: "birth_date", icon: "birthdate.png" },
        { label: "Age", key: "age", icon: "birthdate.png" },
        { label: "Nationality", key: "nationality", icon: "gender.png" },
        { label: "Address", key: "address", icon: "address.png" },
        { label: "Postal Code", key: "postal_code", icon: "address.png" },
        {
            label: "Registration Date",
            key: "registration_date",
            icon: "admissiondate.png",
        },
    ];

    return (
        <ProfileView
            profileType="student"
            fetchEndpoint="/students"
            profileFields={studentFields}
            title="Student"
        />
    );
}