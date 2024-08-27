import React, { useState } from "react";
import axiosClient from "../axiosClient";
import { Form, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/Button/Button";
import "../css/ForgotResetPassword.css";

export default function ResetPassword() {
    const { token } = useParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Clear previous messages
        setMessage("");
        setErrors({});

        // Send the reset password request to the backend
        axiosClient
            .post("/reset-password", {
                token,
                email,
                password,
                password_confirmation: passwordConfirmation,
            })
            .then((response) => {
                // If successful, show a success message and redirect to login
                setMessage(
                    "Password has been reset successfully. You can now log in."
                );
                setTimeout(() => navigate("/login"), 2000); // Redirect after 2 seconds
            })
            .catch((error) => {
                // Handle validation errors
                if (error.response && error.response.data.errors) {
                    setErrors(error.response.data.errors);
                } else {
                    // Handle general errors
                    setErrors({
                        general: "An error occurred. Please try again.",
                    });
                }
            });
    };

    // Function to clear the specific error when the user starts typing
    const clearError = (field) => {
        setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    };

    return (
        <div className="reset-password-form-container box-area row p-3">
            <div className="col p-5">
                <div className="row">
                    <img
                        src="http://localhost:8000/images/reset-password-element.png"
                        alt="Reset password illustration"
                        className="reset-password-illustration mb-4"
                    />

                    <h2 className="text-center mb-2">Reset Password</h2>
                    <small className="reset-password-message text-center mb-4">
                        Reset your new password here
                    </small>

                    {/* Success message */}
                    {message && <Alert variant="success">{message}</Alert>}

                    {/* General error message */}
                    {errors.general && (
                        <Alert variant="danger">{errors.general}</Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                        {/* Email Input */}
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                name="email"
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    clearError("email");
                                }}
                                isInvalid={!!errors.email}
                                className="email-placeholder"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Control
                                type="password"
                                placeholder="Enter new password"
                                value={password}
                                name="password"
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    clearError("password");
                                }}
                                isInvalid={!!errors.password}
                                className="newpassword-placeholder"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="formPasswordConfirmation">
                            <Form.Control
                                type="password"
                                placeholder="Confirm new password"
                                value={passwordConfirmation}
                                name="password_confirmation"
                                onChange={(e) => {
                                    setPasswordConfirmation(e.target.value);
                                    clearError("password_confirmation");
                                }}
                                isInvalid={!!errors.password_confirmation}
                                className="confirm-password-placeholder"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password_confirmation}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <div className="d-grid">
                            <Button
                                className="btn-create-yellow"
                                type="submit"
                                variant="primary"
                            >
                                Reset
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}
