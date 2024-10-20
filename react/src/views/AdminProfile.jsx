import React, { useState, useEffect } from "react";
import axiosClient from "../axiosClient";
import Button from "../components/Button/Button";
import "../css/AdminProfile.css";

export default function CenterProfile() {
    const [centerProfile, setCenterProfile] = useState({
        centerName: "",
        centerLogo: "",
        favicon: "",
        address: "",
        postcode: "",
        state: "",
        city: "",
    });

    const statesMY = [
        "Perlis",
        "Kedah",
        "Pulau Pinang",
        "Perak",
        "Kelantan",
        "Selangor",
        "Kuala Lumpur",
        "Putrajaya",
        "Labuan",
        "Pahang",
        "Terengganu",
        "Negeri Sembilan",
        "Melaka",
        "Johor",
        "Sabah",
        "Sarawak",
    ];

    // State to track if fields are editable
    const [isEditing, setIsEditing] = useState(false);

    // Enable editing mode
    const handleEdit = () => {
        setIsEditing(true);
    };

    // Return to non-editable mode
    const handleSave = () => {
        // You can add logic here to save changes (e.g., API call)
        setIsEditing(false);
    };

    // Return to non-editable mode
    const handleCancel = () => {
        // Optionally reset the form to its original values if needed
        setIsEditing(false);
    };
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     async function fetchProfile() {
    //         try {
    //             const res = await axiosClient.get("/center-profile");

    //             console.log(res.data.centerProfile[0]);
    //             // Ensure the fetched data matches the state structure
    //             setCenterProfile({
    //                 centerName: res.data.centerProfile[0].center_name,
    //                 centerLogo: res.data.centerProfile[0].center_logo,
    //                 centerAddress: res.data.centerProfile[0].center_address,
    //                 postcode: res.data.centerProfile[0].postcode,
    //             });
    //             setLoading(false);
    //         } catch (error) {
    //             console.error("Error fetching profile:", error);
    //             setLoading(true);
    //         }
    //     }

    //     fetchProfile();
    // }, []);

    // if (loading) {
    //     return <div className="p-3">Loading...</div>;
    // }

    // To make form inputs editable
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCenterProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            // .append is a method used to add key-value pair
            // syntax: formData.append(name, value, filename);
            formData.append("centerName", centerProfile.centerName);
            formData.append("centerAddress", centerProfile.centerAddress);
            formData.append("postcode", centerProfile.postcode);
            formData.append("numRooms", centerProfile.numRooms);
            // if (centerLogoFile) {
            //     formData.append("centerLogo", centerLogoFile);
            // }

            const response = await axiosClient.post(
                "http://127.0.0.1:8000/api/update-center-profile",
                formData
            );

            console.log(response.data);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <>
            <div className="page-title">Settings</div>
            <div className="profile-container mt-5">
                <div className="top-section"></div>
                <div className="bottom-section">
                    <div className="page-content">
                        <h3>Tuition Center Profile</h3>
                        <div className="d-flex flex-column gap-3 mt-5">
                            <div className="input-group d-flex align-items-center">
                                <div className="label">Center Name</div>
                                <input
                                    name="centerName"
                                    type="text"
                                    className="form-control"
                                    value={centerProfile.centerName}
                                    onChange={handleInputChange}
                                    readOnly={!isEditing} // Set readOnly based on isEditing state
                                    required
                                />
                            </div>
                            <div className="input-group d-flex align-items-center">
                                <div className="label">Center Logo</div>
                                <input
                                    name="centerLogo"
                                    type="text"
                                    className="form-control"
                                    value={centerProfile.centerLogo}
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                    required
                                />
                            </div>
                            <div className="input-group d-flex align-items-center">
                                <div className="label">Favicon</div>
                                <input
                                    name="favicon"
                                    type="text"
                                    className="form-control"
                                    value={centerProfile.centerFavicon}
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                    required
                                />
                            </div>
                            <div className="input-group d-flex align-items-center">
                                <div className="label">Center Address</div>
                                <input
                                    name="address"
                                    type="text"
                                    className="form-control"
                                    value={centerProfile.address}
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                    required
                                />
                            </div>
                        </div>
                        <div className="d-flex gap-3 mt-3">
                            <div className="input-group d-flex align-items-center">
                                <div className="label">Postcode</div>
                                <input
                                    name="postcode"
                                    type="number"
                                    className="form-control"
                                    value={centerProfile.postcode}
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                    required
                                />
                            </div>
                            <div className="input-group d-flex align-items-center">
                                <div className="label">City</div>
                                <input
                                    name="city"
                                    type="text"
                                    className="form-control"
                                    value={centerProfile.city}
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                    required
                                />
                            </div>
                        </div>
                        <div className="d-flex gap-3 mt-3">
                            <div className="input-group d-flex align-items-center">
                                <div className="label">State</div>
                                <select
                                    name="state"
                                    className="form-control"
                                    onChange={handleInputChange}
                                    value={centerProfile.state}
                                    readOnly={!isEditing}
                                    required
                                >
                                    <option value="" disabled>
                                        Select a state
                                    </option>
                                    {statesMY.map((state, index) => (
                                        <option key={index} value={state}>
                                            {state}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group d-flex align-items-center">
                                <div className="label">Country</div>
                                <input
                                    type="text"
                                    className="form-control"
                                    value="Malaysia"
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="button-container d-flex justify-content-end pt-5 gap-3">
                            {!isEditing ? (
                                <Button color="yellow" onClick={handleEdit}>
                                    Edit
                                </Button>
                            ) : (
                                <>
                                    <Button color="yellow" onClick={handleSave}>
                                        Save
                                    </Button>
                                    <Button
                                        onClick={handleCancel}
                                        className="ml-2"
                                    >
                                        Cancel
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="pic-container">
                    <img
                        className="profile-pic"
                        src={`${window.location.protocol}//${window.location.hostname}:8000/images/center-profile-default.png`}
                    />
                </div>
            </div>
        </>

        // <div className="p-4">
        //     <h2>Admin Tuition Center Profile</h2>
        //     {isEditing ? (
        //         <div className="form-container">
        //             <form onSubmit={handleSubmit}>
        //                 <div className="form-group mb-3">
        //                     <label>Center Name:</label>
        //                     <input
        //                         type="text"
        //                         className="form-control"
        //                         name="centerName"
        //                         value={centerProfile.centerName}
        //                         onChange={handleInputChange}
        //                         required
        //                     />
        //                 </div>
        //                 <div className="form-group mb-3">
        //                     <label className="me-2">Center Logo:</label>
        //                     <input
        //                         type="file"
        //                         className="form-control-file"
        //                         accept="image/*"
        //                         name="centerLogo"
        //                         onChange={handleLogoChange}
        //                         required
        //                     />
        //                     {centerProfile.centerLogo && (
        //                         <img
        //                             src={centerProfile.centerLogo}
        //                             alt="Center Logo"
        //                             className="img-thumbnail mt-2"
        //                             width="100"
        //                         />
        //                     )}
        //                 </div>
        //                 <div className="form-group mb-3">
        //                     <label>Center Address:</label>
        //                     <input
        //                         type="text"
        //                         className="form-control"
        //                         name="centerAddress"
        //                         value={centerProfile.centerAddress}
        //                         onChange={handleInputChange}
        //                         required
        //                     />
        //                 </div>
        //                 <div className="form-group mb-3">
        //                     <label>Postcode:</label>
        //                     <input
        //                         type="text"
        //                         className="form-control"
        //                         name="postcode"
        //                         value={centerProfile.postcode}
        //                         onChange={handleInputChange}
        //                         required
        //                     />
        //                 </div>
        //                 <div className="form-group mb-3">
        //                     <label>Number of Physical Rooms:</label>
        //                     <input
        //                         type="number"
        //                         className="form-control"
        //                         name="numRooms"
        //                         value={centerProfile.numRooms}
        //                         onChange={handleInputChange}
        //                         required
        //                     />
        //                 </div>
        //                 <button type="submit" className="btn btn-primary me-2">
        //                     Save Profile
        //                 </button>
        //                 <button
        //                     type="button"
        //                     className="btn btn-secondary ml-2"
        //                     onClick={() => setIsEditing(false)}
        //                 >
        //                     Cancel
        //                 </button>
        //             </form>
        //         </div>
        //     ) : (
        //         <div>
        //             <div className="mb-3">
        //                 <strong>Center Name:</strong> {centerProfile.centerName}
        //             </div>
        //             {/* <div className="mb-3">
        //                 <strong>Center Logo:</strong>
        //                 <br />
        //                 {centerProfile.centerLogo && (
        //                     <img
        //                         src={centerProfile.centerLogo}
        //                         alt="Center Logo"
        //                         className="img-thumbnail mt-2"
        //                         width="100"
        //                     />
        //                 )}
        //             </div> */}
        //             <div className="mb-3">
        //                 <strong>Center Address:</strong>{" "}
        //                 {centerProfile.centerAddress}
        //             </div>
        //             <div className="mb-3">
        //                 <strong>Postcode:</strong> {centerProfile.postcode}
        //             </div>
        //             <div className="mb-3">
        //                 <strong>Number of Physical Rooms:</strong>{" "}
        //                 {centerProfile.numRooms}
        //             </div>
        //             <button
        //                 type="button"
        //                 className="btn btn-primary"
        //                 onClick={() => setIsEditing(true)}
        //             >
        //                 Edit Profile
        //             </button>
        //         </div>
        //     )}
        // </div>
    );
}
