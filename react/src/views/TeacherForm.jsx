import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import Form from "react-bootstrap/Form";
import Button from "../components/Button/Button";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import LoginDetailsForm from "../components/Form/LoginDetailsForm";
import BasicDetailsForm from "../components/Form/BasicDetailsForm";
import Spinner from "react-bootstrap/Spinner";

export default function TeacherForm({ isEditing }) {
    // Get the ID from the route parameters
    const { id } = useParams();

    // Use the navigate hook to redirect to another page
    const navigate = useNavigate();

    const [loginDetails, setLoginDetails] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role_id: 2, // Role ID 2 for teacher
    });

    const [teacherDetails, setTeacherDetails] = useState({
        phone_number: "",
        gender: "",
        age: "",
        birth_date: "",
        nationality: "",
        address: "",
        postal_code: "",
        subject_ids: [], // Array to store multiple subject teaching id
    });

    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [errors, setErrors] = useState({});
    const [userId, setUserId] = useState(null);
    const [teacherId, setTeacherId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // If editing and ID is available
        if (isEditing && id) {
            const fetchTeacherData = async () => {
                // Set loading to true while fetching data
                setLoading(true);
                try {
                    // Fetch teacher data using the ID
                    const teacherResponse = await axiosClient.get(
                        `/teachers/${id}`
                    );

                    // Get the user_id and teacher_id from the response
                    const fetchedUserId = teacherResponse.data.user_id;
                    const fetchedTeacherId = teacherResponse.data.id;
                    //  Set the user_id and teacher_id
                    setUserId(fetchedUserId);
                    setTeacherId(fetchedTeacherId);

                    // Set the login, teacher basic info
                    setLoginDetails({
                        name: teacherResponse.data.name,
                        email: teacherResponse.data.email,
                        role_id: teacherResponse.data.role_id,
                    });

                    setTeacherDetails({
                        phone_number: teacherResponse.data.phone_number,
                        gender: teacherResponse.data.gender,
                        birth_date: teacherResponse.data.birth_date,
                        age: calculateAge(teacherResponse.data.birth_date),
                        nationality: teacherResponse.data.nationality,
                        address: teacherResponse.data.address,
                        postal_code: teacherResponse.data.postal_code,
                    });
                } catch (error) {
                    console.error("Error fetching teacher data:", error);
                } finally {
                    // Set loading to false after fetching data
                    setLoading(false);
                }
            };

            // Call the fetchTeacherData function
            fetchTeacherData();
        }
    }, [isEditing, id]);

    // Function to calculate age from birth date
    const calculateAge = (birthDate) => {
        // Get today's date
        const today = new Date();

        // Get the birth date
        const birth = new Date(birthDate);

        // Calculate the age
        let age = today.getFullYear() - birth.getFullYear();

        // // Get the difference in months
        const monthDiff = today.getMonth() - birth.getMonth();

        // If the birth month is greater than the current month
        // or if the birth month is the same as the current month
        // but the birth date is greater than the current date
        // then subtract 1 from the age
        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birth.getDate())
        ) {
            age--;
        }
        return age;
    };

    // Function to handle changes in the login details
    const handleLoginChange = (e) => {
        // Get the name and value from the input field
        const { name, value } = e.target;

        //  Update the login details state
        setLoginDetails({ ...loginDetails, [name]: value });

        // Clear the specific error when the user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    // Function to handle changes in the teacher details
    const handleTeacherChange = (e) => {
        // Get the name and value from the input field
        const { name, value } = e.target;

        // Set the teacher details
        // Calculate the age if the birth_date is changed
        // and set the age in the teacher details
        // Otherwise, set the teacher details as usual
        if (name === "birth_date") {
            const age = calculateAge(value);
            setTeacherDetails({ ...teacherDetails, [name]: value, age: age });
        } else {
            setTeacherDetails({ ...teacherDetails, [name]: value });
        }

        // Clear the specific error when the user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate input fields
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Set loading to true while saving data
        setLoading(true);
        try {
            // If editing, update the teacher details
            if (isEditing) {
                if (userId) {
                    // Update the user details
                    await axiosClient.put(`/users/${userId}`, loginDetails);
                }

                if (teacherId) {
                    // Update the teacher details
                    await axiosClient.put(`/teachers/${teacherId}`, {
                        ...teacherDetails,
                        user_id: userId,
                    });
                }
                // If creating a new teacher
            } else {
                // Create the user
                const userResponse = await axiosClient.post(
                    "/users",
                    loginDetails
                );
                const newUserId = userResponse.data.id;

                // Create the teacher using the user_id from the response
                const teacherResponse = await axiosClient.post(`/teachers`, {
                    ...teacherDetails,
                    // Associate teacher with the created user
                    user_id: newUserId,
                });
            }

            alert(`Teacher ${isEditing ? "updated" : "created"} successfully`);

            // Redirect to the teacher list page
            navigate("/teacher");
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data.errors);
            } else {
                alert("Error saving teacher: " + error.message);
            }
        } finally {
            // Set loading to false after saving data
            setLoading(false);
        }
    };

    // Function to validate input fields
    const validate = () => {
        const errors = {};

        // Validate login details
        if (!loginDetails.name) {
            errors.name = "Name is required";
        }

        if (!loginDetails.email) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(loginDetails.email)) {
            errors.email = "Please use the correct email format";
        }

        // Validate password and confirm password
        // Only validate password when editing if the password or confirm password is changed
        if (isEditing) {
            if (loginDetails.password || loginDetails.confirmPassword) {
                if (!loginDetails.password) {
                    errors.password = "Password is required when confirming";
                } else if (loginDetails.password.length < 8) {
                    errors.password =
                        "Password length must be at least 8 characters";
                } else if (
                    loginDetails.password !== loginDetails.confirmPassword
                ) {
                    errors.confirmPassword = "Passwords do not match";
                }

                if (!loginDetails.confirmPassword) {
                    errors.confirmPassword = "Confirm password is required";
                }
            }
            // Validate password and confirm password when creating a new teacher
        } else {
            if (!loginDetails.password) {
                errors.password = "Password is required";
            } else if (loginDetails.password.length < 8) {
                errors.password =
                    "Password length must be at least 8 characters";
            } else if (loginDetails.password !== loginDetails.confirmPassword) {
                errors.confirmPassword = "Passwords do not match";
            }

            if (!loginDetails.confirmPassword) {
                errors.confirmPassword = "Confirm password is required";
            }
        }

        // Validate teacher details
        if (!teacherDetails.phone_number) {
            errors.phone_number = "Phone number is required";
        } else if (!/^\d{10,15}$/.test(teacherDetails.phone_number)) {
            errors.phone_number =
                "Phone number must be between 10 to 15 digits";
        }

        if (!teacherDetails.gender) {
            errors.gender = "Gender is required";
        }

        if (!teacherDetails.birth_date) {
            errors.birth_date = "Birth date is required";
        }

        if (!teacherDetails.nationality) {
            errors.nationality = "Nationality is required";
        }

        if (!teacherDetails.address) {
            errors.address = "Address is required";
        }

        if (!teacherDetails.postal_code) {
            errors.postal_code = "Postal code is required";
        } else if (!/^\d{5,6}$/.test(teacherDetails.postal_code)) {
            errors.postal_code = "Postal code must be 5 or 6 digits";
        }

        return errors;
    };

    return (
        <>
            {/* <div className="page-title">{isEditing ? 'Edit Teacher' : 'Create Teacher'}</div> */}
            <div className="page-title">Teachers</div>
            {loading ? (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "400px" }}
                >
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Form onSubmit={handleSubmit}>
                    <ContentContainer title="Login Details">
                        <LoginDetailsForm
                            loginDetails={loginDetails}
                            handleLoginChange={handleLoginChange}
                            errors={errors}
                            fixedRole={2}
                        />
                    </ContentContainer>

                    <ContentContainer title="Teacher Details">
                        <BasicDetailsForm
                            basicDetails={teacherDetails}
                            handleBasicDetailsChange={handleTeacherChange}
                            errors={errors}
                        />
                    </ContentContainer>

                    <div className="d-flex justify-content-end mt-4 mb-4">
                        <Button
                            className="btn-create-yellow"
                            type="submit"
                            variant="primary"
                        >
                            {isEditing ? "Save" : "Create"}
                        </Button>
                    </div>
                </Form>
            )}
        </>
    );
}
