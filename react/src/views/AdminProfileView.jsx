// import { useEffect, useState, useRef } from "react";
// import { useParams, Link } from "react-router-dom";
// import axiosClient from "../axiosClient";
// import Button from "../components/Button/Button";
// import { ContentContainer } from "../components/ContentContainer/ContentContainer";
// import { Table } from "../components/Table/Table";
// import Spinner from "react-bootstrap/Spinner";

// export default function AdminProfileView() {
//     const { id } = useParams();

//     const [adminData, setAdminData] = useState({
//         admin: {}, 
//         loading: true,
//     });

//     const [error, setError] = useState("");

//     const [profileImage, setProfileImage] = useState(
//         "http://localhost:8000/images/user-profile.png" // Default image URL
//     );

//     const fileInputRef = useRef(null);

//     // Fetch student data
//     useEffect(() => {
//         async function fetchAdmin() {

//             try {
//                 const res = await axiosClient.get(`/admins/${id}`);
//                 setAdminData({
//                     admin: res.data, 
//                     loading: false,
//                 });
//             } catch (error) {
//                 console.error("Error fetching admin:", error);
//                 setAdminData({
//                     admin: {},
//                     loading: false,
//                 });
//                 setError(
//                     "Error fetching admin data. Please try again later."
//                 );
//             }
//         }

//         fetchAdmin();
//     }, [id]);

//     console.log("adminData 1", adminData);

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

//     // const teacher = teacherData.teacher;
//     const { admin, loading } = adminData;
//     console.log('admin', admin)

//     // Define the table headers for parent and subject enrollment
//     const tableHeaderLogin = [
//         "ID",
//         "Email",
//         "Password",
//     ];

//     console.log("admindata:" , adminData);

//     // Prepare parent details and subject enrollment data
//     const tableDataLogin = loading
//     ? [
//         [
//             <td key="loading" colSpan="3" className="text-center">
//                 <Spinner animation="border" variant="primary" />
//             </td>,
//         ],
//     ]
//     : admin.login_details
//         ? [
//             [
//                 admin.login_details.id || "-",
//                 admin.login_details.email || "-",
//                 "********",
//             ],
//         ]
//         : [];

//           // Show loading spinner if loading is true
//     if (adminData.loading) {
//         return (
//             <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
//                 <Spinner animation="border" variant="primary" />
//             </div>
//         );
//     }

//     return (
//         <>
//             <div className="page-title">Admin</div>

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
//                                 <h2>{adminData.admin.name}</h2>
//                                 <p>
//                                     <small>Admin</small>
//                                 </p>
//                             </div>

//                             <div className="row mt-5">
//                                 <div className="col-4">
//                                     <div className="d-flex">
//                                         <div className="me-3">
//                                             <img
//                                                 src="http://localhost:8000/icon/email.png"
//                                                 alt="Email"
//                                             />
//                                         </div>
//                                         <div>
//                                             <p>Email:</p>
//                                             <p>{adminData.admin.email}</p>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="col-4">
//                                     <div className="d-flex">
//                                         <div className="me-3">
//                                             <img
//                                                 src="http://localhost:8000/icon/phone.png"
//                                                 alt="Phone Number"
//                                             />
//                                         </div>
//                                         <div>
//                                             <p>Phone Number:</p>
//                                             <p>
//                                                 {adminData.admin.phone_number}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>

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
//                                             <p>{adminData.admin.gender}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="row mt-5">
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
//                                                 {adminData.admin.birth_date}
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
//                                             <p>{adminData.admin.age}</p>
//                                         </div>
//                                     </div>
//                                 </div>

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
//                                                     adminData.admin
//                                                         .nationality
//                                                 }
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>

//                             </div>

//                             <div className="row mt-5">
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
//                                             <p>{adminData.admin.address}</p>
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
//                                                     adminData.admin
//                                                         .postal_code
//                                                 }
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="col-4">
//                                     <div className="d-flex">
//                                         <div className="me-3">
//                                             <img
//                                                 src="http://localhost:8000/icon/admissiondate.png"
//                                                 alt="Admission Date"
//                                             />
//                                         </div>
//                                         <div>
//                                             <p>Admission Date:</p>
//                                             <p>
//                                                 {
//                                                     adminData.admin
//                                                         .joining_date
//                                                 }
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                 </ContentContainer>
//             </div>

//             <ContentContainer title="Login Details">
//                 {error && <div className="alert alert-danger">{error}</div>}
//                 <Table
//                     header={tableHeaderLogin}
//                     data={tableDataLogin}
//                     itemsPerPage={3}
//                 />
//             </ContentContainer>

//             <div className="d-flex justify-content-end mt-3">
//                 <div className="me-3">
//                     <Link
//                         to={`/admin/edit/${id}`}
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
//                     <Link to="/admin" className="text-decoration-none">
//                         <Button>Back</Button>
//                     </Link>
//                 </div>
//             </div>

//         </>

//     );

// }

import ProfileView from "./ProfileView";

export default function AdminProfileView() {
    // Define the fields to display in the admin's basic info
    const adminFields = [
        { label: "Email", key: "email", icon: "email.png" },
        { label: "Phone Number", key: "phone_number", icon: "phone.png" },
        { label: "Gender", key: "gender", icon: "gender.png" },
        { label: "Birth Date", key: "birth_date", icon: "birthdate.png" },
        { label: "Age", key: "age", icon: "birthdate.png" },
        { label: "Nationality", key: "nationality", icon: "gender.png" },
        { label: "Address", key: "address", icon: "address.png" },
        { label: "Postal Code", key: "postal_code", icon: "address.png" },
        {
            label: "Admission Date",
            key: "joining_date",
            icon: "admissiondate.png",
        },
    ];

    return (
        <ProfileView
            profileType="admin"
            fetchEndpoint="/admins"
            profileFields={adminFields}
            title="Admin"
        />
    );
}
