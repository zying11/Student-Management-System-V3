import React, { useState } from "react";
import axiosClient from "../axiosClient";
import { Link } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import Button from "../components/Button/Button";
import "../css/ForgotResetPassword.css";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState("");
    const [showTimeMessage, setShowTimeMessage] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Clear previous messages
        setMessage("");
        setErrors("");

        // Show the "time message" immediately after clicking submit
        setShowTimeMessage(true);

        // Send the forgot password request to the backend
        axiosClient
            .post("/forgot-password", { email })
            .then((response) => {
                // If successful, show a success message
                setMessage("Reset link has been sent to your email.");
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
            })
            .finally(() => {
                // Hide the time message once the process is complete
                setShowTimeMessage(false);
            });
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        // Clear email-related errors when the user starts typing
        if (errors.email) {
            setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
        }
    };

    // Function to clear the specific error when the user starts typing
    const clearError = (field) => {
        setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    };

    return (
        <div className="forgot-password-form-container box-area row p-3">
            <div className="col p-5">
                <div className="row ">
                    <img
                        src="/images/padlock-element.png"
                        alt="Forgot password illustration"
                        className="forgot-password-illustration mb-4"
                    />

                    <h2 className="text-center mb-2">Forgot Password?</h2>
                    <small className="forgot-password-message text-center mb-4">
                        Enter your email and we will send you a link to reset
                        your password.
                    </small>

                    {/* Success message */}
                    {message && <Alert variant="success">{message}</Alert>}

                    {/* General error message */}
                    {errors.general && (
                        <Alert variant="danger">{errors.general}</Alert>
                    )}

                    {/* Temporary message when the user submits the form */}
                    {showTimeMessage && (
                        <Alert variant="info" className="text-center">
                            It may take some time for the email to be delivered.
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-4" controlId="formEmail">
                            <Form.Control
                                type="email"
                                placeholder="Enter your email here"
                                value={email}
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

                        <div className="d-grid">
                            <Button
                                className="btn-create-yellow"
                                type="submit"
                                variant="primary"
                            >
                                Email Me
                            </Button>
                        </div>

                        <div className="d-grid justify-content-center">
                            <Link to="/login" className="text-decoration-none">
                                <Button className="link-button" color="">
                                    Sign in
                                </Button>
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}
