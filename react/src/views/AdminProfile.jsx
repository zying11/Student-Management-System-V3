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
    const handleCancel = () => {
        // Optionally reset the form to its original values if needed
        setIsEditing(false);
    };

    // To make form inputs editable
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCenterProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    // Variable to display profile pic
    const [selectedImage, setSelectedImage] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0]; // Get the first selected file
        if (file) {
            setSelectedImage(URL.createObjectURL(file)); // Create preview URL for immediate display
            setCenterProfile({
                ...centerProfile,
                centerLogo: file, // Store the selected file in the state
            });
        }
    };

    useEffect(() => {
        console.log(centerProfile); // This will log the updated state after the file change
    }, [centerProfile]); // This effect runs whenever `centerProfile` is updated

    // const [loading, setLoading] = useState(true);

    // Display profile data
    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await axiosClient.get("/center-profile");

                // console.log(res.data.centerProfile[0]);
                // Ensure the fetched data matches the state structure
                setCenterProfile({
                    centerName: res.data.centerProfile[0].center_name,
                    centerLogo: res.data.centerProfile[0].center_logo,
                    address: res.data.centerProfile[0].address,
                    postcode: res.data.centerProfile[0].postcode,
                    city: res.data.centerProfile[0].city,
                    state: res.data.centerProfile[0].state,
                });

                // setLoading(false);
            } catch (error) {
                console.error("Error fetching profile:", error);
                // setLoading(true);
            }
        }

        fetchProfile();
    }, []);

    // if (loading) {
    //     return <div className="p-3">Loading...</div>;
    // }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("centerName", centerProfile.centerName);
            formData.append("address", centerProfile.address); // Corrected key for address
            formData.append("postcode", centerProfile.postcode);
            formData.append("city", centerProfile.city);
            formData.append("state", centerProfile.state);

            if (centerProfile.centerLogo) {
                formData.append("centerLogo", centerProfile.centerLogo);
            }

            const res = await axiosClient.post(
                "/update-center-profile",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data", // Ensure correct header for file upload
                    },
                }
            );

            if (res.status === 200) {
                const { logo_url } = res.data;

                // Update the image URL to display the newly uploaded image
                setCenterProfile({
                    ...centerProfile,
                    centerLogo: logo_url, // Set the logo URL from the response
                });
            }

            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <>
            <div className="page-title">Settings</div>
            <div className="profile-container mt-5 p-5">
                <div className="pic-container mb-3 d-flex justify-content-center">
                    <img
                        className="profile-pic"
                        src={
                            selectedImage
                                ? selectedImage // Show the newly selected image preview
                                : `${window.location.protocol}//${
                                      window.location.hostname
                                  }:8000/profile/${
                                      centerProfile.centerLogo ||
                                      "center-profile-default.png"
                                  }`
                        }
                        alt="Center Logo"
                    />
                </div>
                <div className="bottom-section">
                    <div className="page-content">
                        <h3>Tuition Center Profile</h3>
                        <form onSubmit={handleSubmit} method="post">
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
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        disabled={!isEditing} // File selection handler
                                    />
                                </div>
                                {/* <div className="input-group d-flex align-items-center">
                                    <div className="label">Favicon</div>
                                    <input
                                        name="favicon"
                                        type="text"
                                        className="form-control"
                                        value={centerProfile.favicon}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        required
                                    />
                                </div> */}
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
                                        disabled={!isEditing} // Dynamically disable the select when not in editing mode, readOnly only works in input field
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
                        </form>

                        <div className="button-container d-flex justify-content-end pt-5 gap-3">
                            {!isEditing ? (
                                <Button
                                    type="button"
                                    color="yellow"
                                    onClick={handleEdit}
                                >
                                    Edit
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        type="submit"
                                        color="yellow"
                                        onClick={handleSubmit}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        type="button"
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
            </div>
        </>
    );
}
