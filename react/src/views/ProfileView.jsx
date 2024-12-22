import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../axiosClient";
import Spinner from "react-bootstrap/Spinner";
import { Table } from "../components/Table/Table";
import Button from "../components/Button/Button";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import { useStateContext } from "../contexts/ContextProvider";

export default function ProfileView({
    profileType,
    fetchEndpoint,
    profileFields,
    title,
    defaultImage = "http://localhost:8000/images/user-profile.png",
}) {
    // Access the logged-in user with their role
    const { user } = useStateContext();
    const { id } = useParams();
    const [profileData, setProfileData] = useState({ data: {}, loading: true });
    const [error, setError] = useState("");
    const [profileImage, setProfileImage] = useState(defaultImage);

    const fileInputRef = useRef(null);

    //  Days of the week
    const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    // Fetch profile data
    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await axiosClient.get(`${fetchEndpoint}/${id}`);
                setProfileData({ data: res.data, loading: false });
            } catch (error) {
                console.error(`Error fetching ${profileType}:`, error);
                setProfileData({ data: {}, loading: false });
                setError(
                    `Error fetching ${profileType} data. Please try again later.`
                );
            }
        }
        fetchProfile();
    }, [id, fetchEndpoint, profileType]);

    // // Handle profile image click
    // const handleProfileImageClick = () => {
    //     // Open file input dialog
    //     fileInputRef.current.click();
    // };

    // Handle image change
    const handleImageChange = (event) => {
        // Get the selected file
        const file = event.target.files[0];
        // Check if file is selected and file size is less than 2MB
        if (file && file.size <= 2 * 1024 * 1024) {
            // Read the file and set the profile image
            const reader = new FileReader();
            // Set the profile image to the selected file
            reader.onloadend = () => setProfileImage(reader.result);
            // Read the file as data URL
            reader.readAsDataURL(file);
        } else {
            setError("File size exceeds the limit of 2MB");
        }
    };

    // If profile data is still loading, display a spinner
    if (profileData.loading) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "400px" }}
            >
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    // Get the profile data
    const profile = profileData.data;

    return (
        <>
            <div className="page-title">{title}</div>

            {/* Display the user basic info */}
            <div className="mt-3">
                <img
                    src="http://localhost:8000/images/profile-bg.png"
                    alt="Profile Background"
                    style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                    }}
                />
                <ContentContainer
                    className="profile-detail-container"
                    style={{ position: "relative" }}
                >
                    <div className="d-flex flex-column">
                        <div
                            style={{
                                position: "absolute",
                                top: "-150px",
                                left: "7%",
                                transform: "translateX(-50%)",
                                zIndex: 1,
                            }}
                        >
                            <img
                                src={profileImage}
                                alt="Profile"
                                onError={(e) => (e.target.src = defaultImage)}
                                // onClick={handleProfileImageClick}
                                style={{
                                    width: "180px",
                                    height: "180px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    cursor: "pointer",
                                    border: "5px solid white",
                                }}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                ref={fileInputRef}
                                style={{ display: "none" }}
                            />
                        </div>

                        {/* Display the user name */}
                        <div className="mt-5">
                            <h2>{profile.name}</h2>
                            <p>
                                <small>{profileType}</small>
                            </p>
                        </div>

                        {/* Display other specific profile details based on user */}
                        <div className="row">
                            {profileFields.map((field, idx) => (
                                <div className="col-4 mt-5" key={idx}>
                                    <div className="d-flex">
                                        <div className="me-3">
                                            <img
                                                src={`http://localhost:8000/icon/${field.icon}`}
                                                alt={field.label}
                                            />
                                        </div>
                                        <div>
                                            <p>{field.label}:</p>
                                            <p>{profile[field.key]}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </ContentContainer>
            </div>

            {(profileType === "admin" || profileType === "teacher") && (
                <ContentContainer title="Login Details">
                    {error && <div className="alert alert-danger">{error}</div>}
                    <Table
                        header={["ID", "Email", "Password"]}
                        data={
                            profile.login_details
                                ? [
                                      [
                                          profile.login_details.id,
                                          profile.login_details.email,
                                          "********",
                                      ],
                                  ]
                                : []
                        }
                        itemsPerPage={3}
                    />
                </ContentContainer>
            )}

            {profileType === "teacher" && (
                <ContentContainer title="Subject Teaching Details">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {profile.subject_teaching &&
                    Array.isArray(profile.subject_teaching) &&
                    profile.subject_teaching.length > 0 ? (
                        <Table
                            header={[
                                "ID",
                                "Subject",
                                "Study Level",
                                "Class Time",
                                "Venue",
                            ]}
                            data={profile.subject_teaching.map(
                                (subjectTeaching) => [
                                    subjectTeaching.lesson_id || "-",
                                    subjectTeaching.subject_name || "-",
                                    subjectTeaching.study_level_name || "-",
                                    `${subjectTeaching.start_time || "N/A"} - ${
                                        subjectTeaching.end_time || "N/A"
                                    } (${
                                        daysOfWeek[subjectTeaching.day] || "N/A"
                                    })`,
                                    subjectTeaching.room_name || "-",
                                ]
                            )}
                            itemsPerPage={3}
                        />
                    ) : (
                        <div className="alert alert-info">
                            Subject teaching details not available.
                        </div>
                    )}
                </ContentContainer>
            )}

            {profileType === "student" && (
                <>
                    <ContentContainer title="Parents Details">
                        {error && (
                            <div className="alert alert-danger">{error}</div>
                        )}
                        {profile.parents &&
                        Array.isArray(profile.parents) &&
                        profile.parents.length > 0 ? (
                            <Table
                                header={["ID", "Parent Name", "Email", "Phone"]}
                                data={profile.parents.map((parent) => [
                                    parent.id || "-",
                                    parent.name || "-",
                                    parent.email || "-",
                                    parent.phone_number || "-",
                                ])}
                                itemsPerPage={3}
                            />
                        ) : (
                            <div className="alert alert-info">
                                Parents details not available.
                            </div>
                        )}
                    </ContentContainer>

                    <ContentContainer title="Subject Enrollment Details">
                        {error && (
                            <div className="alert alert-danger">{error}</div>
                        )}
                        {profile.enrollments &&
                        Array.isArray(profile.enrollments) &&
                        profile.enrollments.length > 0 ? (
                            <Table
                                header={[
                                    "ID",
                                    "Subject",
                                    "Study Level",
                                    "Class Time",
                                    "Teacher Name",
                                ]}
                                data={profile.enrollments.map(
                                    (enrolledSubject) => [
                                        enrolledSubject.id || "-",
                                        enrolledSubject.subject.subject_name ||
                                            "-",
                                        enrolledSubject.study_level
                                            .level_name || "-",
                                        `${
                                            enrolledSubject.lesson.start_time ||
                                            "N/A"
                                        } - ${
                                            enrolledSubject.lesson.end_time ||
                                            "N/A"
                                        } (${
                                            daysOfWeek[
                                                enrolledSubject.lesson.day
                                            ] || "N/A"
                                        }, ${
                                            enrolledSubject.lesson.room || "N/A"
                                        })`,
                                        enrolledSubject.lesson.teacher_name ||
                                            "-",
                                    ]
                                )}
                                itemsPerPage={3}
                            />
                        ) : (
                            <div className="alert alert-info">
                                Subject enrollment details not available.
                            </div>
                        )}
                    </ContentContainer>
                </>
            )}

            {/* Action buttons */}
            <div className="d-flex justify-content-end mt-3">
                {user.role_id === 1 && ( // Only Admin can edit profile
                    <div className="me-3">
                        <Link
                            to={`/${profileType}/edit/${id}`}
                            className="text-decoration-none"
                        >
                            <Button className="btn-create-yellow">Edit</Button>
                        </Link>
                    </div>
                )}
                <div>
                    <Link to={`/students`} className="text-decoration-none">
                        <Button>Back</Button>
                    </Link>
                </div>
            </div>
        </>
    );
}
