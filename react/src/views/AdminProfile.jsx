import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/AdminProfile.css";

export default function CenterProfile() {
    const [centerProfile, setCenterProfile] = useState({
        centerName: "",
        centerLogo: "",
        centerAddress: "",
        postcode: "",
        numRooms: "",
    });
    const [centerLogoFile, setCenterLogoFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await axios.get(
                    "http://127.0.0.1:8000/api/center-profile"
                );

                console.log(res.data.centerProfile[0]);
                // Ensure the fetched data matches the state structure
                setCenterProfile({
                    centerName: res.data.centerProfile[0].center_name,
                    centerLogo: res.data.centerProfile[0].center_logo,
                    centerAddress: res.data.centerProfile[0].center_address,
                    postcode: res.data.centerProfile[0].postcode,
                    numRooms: res.data.centerProfile[0].num_rooms,
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching profile:", error);
                setLoading(true);
            }
        }

        fetchProfile();
    }, []);

    if (loading) {
        return <div className="p-3">Loading...</div>;
    }

    // To make form inputs editable
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCenterProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleLogoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setCenterLogoFile(e.target.files[0]);
            setCenterProfile((prevProfile) => ({
                ...prevProfile,
                centerLogo: URL.createObjectURL(e.target.files[0]),
            }));
        }
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
            if (centerLogoFile) {
                formData.append("centerLogo", centerLogoFile);
            }

            const response = await axios.post(
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
        <div className="p-4">
            <h2>Admin Tuition Center Profile</h2>
            {isEditing ? (
                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label>Center Name:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="centerName"
                                value={centerProfile.centerName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label className="me-2">Center Logo:</label>
                            <input
                                type="file"
                                className="form-control-file"
                                accept="image/*"
                                name="centerLogo"
                                onChange={handleLogoChange}
                                required
                            />
                            {centerProfile.centerLogo && (
                                <img
                                    src={centerProfile.centerLogo}
                                    alt="Center Logo"
                                    className="img-thumbnail mt-2"
                                    width="100"
                                />
                            )}
                        </div>
                        <div className="form-group mb-3">
                            <label>Center Address:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="centerAddress"
                                value={centerProfile.centerAddress}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label>Postcode:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="postcode"
                                value={centerProfile.postcode}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label>Number of Physical Rooms:</label>
                            <input
                                type="number"
                                className="form-control"
                                name="numRooms"
                                value={centerProfile.numRooms}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary me-2">
                            Save Profile
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary ml-2"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            ) : (
                <div>
                    <div className="mb-3">
                        <strong>Center Name:</strong> {centerProfile.centerName}
                    </div>
                    <div className="mb-3">
                        <strong>Center Logo:</strong>
                        <br />
                        {centerProfile.centerLogo && (
                            <img
                                src={centerProfile.centerLogo}
                                alt="Center Logo"
                                className="img-thumbnail mt-2"
                                width="100"
                            />
                        )}
                    </div>
                    <div className="mb-3">
                        <strong>Center Address:</strong>{" "}
                        {centerProfile.centerAddress}
                    </div>
                    <div className="mb-3">
                        <strong>Postcode:</strong> {centerProfile.postcode}
                    </div>
                    <div className="mb-3">
                        <strong>Number of Physical Rooms:</strong>{" "}
                        {centerProfile.numRooms}
                    </div>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit Profile
                    </button>
                </div>
            )}
        </div>
    );
}
