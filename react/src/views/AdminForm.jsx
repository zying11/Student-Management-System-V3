import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import Form from 'react-bootstrap/Form';
import Button from "../components/Button/Button";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import LoginDetailsForm from "../components/Form/LoginDetailsForm";
import BasicDetailsForm from "../components/Form/BasicDetailsForm";
import Spinner from 'react-bootstrap/Spinner';

export default function AdminForm({ isEditing }) {
    // Get the ID from the route parameters
    const { id } = useParams();

    // Use navigate to redirect to another page
    const navigate = useNavigate();

    const [loginDetails, setLoginDetails] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role_id: 1, // Role ID 1 for admin
    });

    const [adminDetails, setAdminDetails] = useState({
        phone_number: "",
        gender: "",
        age: "",
        birth_date: "",
        nationality: "",
        address: "",
        postal_code: "",
    });

    const [errors, setErrors] = useState({});
    const [userId, setUserId] = useState(null);
    const [adminId, setAdminId] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch admin data if editing
    useEffect(() => {
        if (isEditing && id) {
            const fetchAdminData = async () => {
                // Set loading to true while fetching data
                setLoading(true);
                try {
                    // Fetch admin data using the ID
                    const adminResponse = await axiosClient.get(`/admins/${id}`);

                    // Get the user_id and admin_id from the response
                    const fetchedUserId = adminResponse.data.user_id;
                    const fetchedAdminId = adminResponse.data.id;
                    // Set the user_id and admin_id
                    setUserId(fetchedUserId);
                    setAdminId(fetchedAdminId);

                    // Fetch user data using the user_id
                    const userResponse = await axiosClient.get(`/users/${fetchedUserId}`);

                    // Set the login and admin details
                    setLoginDetails({
                        name: userResponse.data.name,
                        email: userResponse.data.email,
                        role_id: userResponse.data.role_id,
                    });

                    setAdminDetails({
                        phone_number: adminResponse.data.phone_number,
                        gender: adminResponse.data.gender,
                        birth_date: adminResponse.data.birth_date,
                        age: calculateAge(adminResponse.data.birth_date),
                        nationality: adminResponse.data.nationality,
                        address: adminResponse.data.address,
                        postal_code: adminResponse.data.postal_code,
                    });
                } catch (error) {
                    console.error('Error fetching admin data:', error);
                } finally {
                    // Set loading to false after fetching data
                    setLoading(false);
                }
            };

            // Call the fetchAdminData function
            fetchAdminData();
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

        // Get the difference in months
        const monthDiff = today.getMonth() - birth.getMonth();

        // If the birth month is greater than the current month
        // or if the birth month is the same as the current month
        // but the birth date is greater than the current date
        // then subtract 1 from the age
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    // Function to handle changes in the login details
    const handleLoginChange = (e) => {
        // Get the name and value from the input field
        const { name, value } = e.target;

        // Set the login details
        setLoginDetails({ ...loginDetails, [name]: value });

        // Clear the specific error when the user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    // Function to handle changes in the admin details
    const handleAdminChange = (e) => {
        // Get the name and value from the input field
        const { name, value } = e.target;

        // Set the admin details
        // Calculate the age if the birth_date is changed
        // and set the age in the admin details
        // Otherwise, set the admin details as usual
        if (name === "birth_date") {
            const age = calculateAge(value);
            setAdminDetails({ ...adminDetails, [name]: value, age: age });
        } else {
            setAdminDetails({ ...adminDetails, [name]: value });
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
            // If editing, update the user and admin details
            if (isEditing) {
                if (userId) {
                    // Update the user details
                    await axiosClient.put(`/users/${userId}`, loginDetails);
                }

                if (adminId) {
                    // Update the admin details
                    await axiosClient.put(`/admins/${adminId}`, {
                        ...adminDetails,
                        user_id: userId,
                    });
                }
                // If creating a new admin
            } else {
                // Create the user
                const userResponse = await axiosClient.post('/users', loginDetails);
                const newUserId = userResponse.data.id;

                // Create the admin using the user_id from the response
                await axiosClient.post('/admins', {
                    ...adminDetails,
                    // Associate admin with the created user
                    user_id: newUserId,
                });
            }

            alert(`Admin ${isEditing ? 'updated' : 'created'} successfully`);

            // Redirect to the admin list page
            navigate('/admin');
        } catch (error) {
            // Handle error when saving data
            if (error.response && error.response.data) {
                setErrors(error.response.data.errors);
            } else {
                alert('Error saving admin: ' + error.message);
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
        // Only validate password when editing
        if (isEditing) {
            // If password or confirm password is entered
            if (loginDetails.password || loginDetails.confirmPassword) {
                if (!loginDetails.password) {
                    errors.password = "Password is required when confirming";
                } else if (loginDetails.password.length < 8) {
                    errors.password = "Password length must be at least 8 characters";
                } else if (loginDetails.password !== loginDetails.confirmPassword) {
                    errors.confirmPassword = "Passwords do not match";
                }

                if (!loginDetails.confirmPassword) {
                    errors.confirmPassword = "Confirm password is required";
                }
            }
            // Validate password and confirm password when creating
        } else {
            if (!loginDetails.password) {
                errors.password = "Password is required";
            } else if (loginDetails.password.length < 8) {
                errors.password = "Password length must be at least 8 characters";
            } else if (loginDetails.password !== loginDetails.confirmPassword) {
                errors.confirmPassword = "Passwords do not match";
            }

            if (!loginDetails.confirmPassword) {
                errors.confirmPassword = "Confirm password is required";
            }
        }

        // Validate admin details
        if (!adminDetails.phone_number) {
            errors.phone_number = "Phone number is required";
        } else if (!/^\d{10,15}$/.test(adminDetails.phone_number)) {
            errors.phone_number = "Phone number must be between 10 to 15 digits";
        }

        if (!adminDetails.gender) {
            errors.gender = "Gender is required";
        }

        if (!adminDetails.birth_date) {
            errors.birth_date = "Birth date is required";
        }

        if (!adminDetails.nationality) {
            errors.nationality = "Nationality is required";
        }

        if (!adminDetails.address) {
            errors.address = "Address is required";
        }

        if (!adminDetails.postal_code) {
            errors.postal_code = "Postal code is required";
        } else if (!/^\d{5,6}$/.test(adminDetails.postal_code)) {
            errors.postal_code = "Postal code must be 5 or 6 digits";
        }

        return errors;
    };

    return (
        <>
            {/* <div className="page-title">{isEditing ? 'Edit Admin' : 'Create Admin'}</div> */}
            <div className="page-title">Admins</div>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Form onSubmit={handleSubmit}>
                    <ContentContainer title="Login Details">

                        <LoginDetailsForm
                            loginDetails={loginDetails}
                            handleLoginChange={handleLoginChange}
                            errors={errors}
                            fixedRole={1}
                        />
                    </ContentContainer>

                    <ContentContainer title="Admin Details">
                        <BasicDetailsForm
                            basicDetails={adminDetails}
                            handleBasicDetailsChange={handleAdminChange}
                            errors={errors}
                        />
                    </ContentContainer>

                    <div className="d-flex justify-content-end mt-4 mb-4">
                        <Button
                            className="btn-create-yellow"
                            type="submit"
                            variant="primary"
                        >
                            {isEditing ? 'Save' : 'Create'}
                        </Button>
                    </div>
                </Form>
            )}
        </>
    );
}
