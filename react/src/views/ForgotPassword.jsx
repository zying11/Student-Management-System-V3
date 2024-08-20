import React, { useState } from 'react';
import axiosClient from '../axiosClient';
import { Link } from "react-router-dom";
import { Form, Alert } from 'react-bootstrap';
import Button from "../components/button/Button";
import "../css/ForgotResetPassword.css";

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Clear previous messages
        setMessage('');
        setErrors('');

        // Send the forgot password request to the backend
        axiosClient.post('/forgot-password', { email })
            .then(response => {
                // If successful, show a success message
                setMessage('Reset link has been sent to your email.');
            })
            .catch(error => {
                // Handle validation errors
                if (error.response && error.response.data.errors) {
                    setErrors(error.response.data.errors);
                } else {
                    // Handle general errors
                    setErrors({ general: 'An error occurred. Please try again.' });
                }
            });
    };

    return (
        <div className="forgot-password-form-container box-area row p-3">

            <div className="col p-5">
                <div className="row ">
                    <img src="http://localhost:8000/images/padlock-element.png" alt="Forgot password illustration" className="forgot-password-illustration mb-4" />

                    <h2 className="text-center mb-2">Forgot Password?</h2>

                    {/* Success message */}
                    {message && <Alert variant="success">{message}</Alert>}

                    {/* General error message */}
                    {errors.general && <Alert variant="danger">{errors.general}</Alert>}

                    <small className="forgot-password-message text-center mb-4">Enter your email and we will send you a link to reset your password</small>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-4" controlId="formEmail">
                            <Form.Control
                                type="email"
                                placeholder="Enter your email here"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="email-placeholder"
                            />
                            {/* Email validation error */}
                            {errors.email && errors.email.map((error, index) => (
                                <Alert key={index} variant="danger">{error}</Alert>
                            ))}
                        </Form.Group>

                        <div className="d-grid">
                            <Button className="btn-create-yellow" type="submit" variant="primary">Email Me</Button>
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
