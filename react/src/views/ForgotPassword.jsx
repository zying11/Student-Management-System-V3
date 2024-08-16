import React, { useState } from 'react';
import axiosClient from '../axiosClient';
import { Form, Button, Alert } from 'react-bootstrap';
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
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Forgot Password</h3>
                            
                            {/* Success message */}
                            {message && <Alert variant="success">{message}</Alert>}
                            
                            {/* General error message */}
                            {errors.general && <Alert variant="danger">{errors.general}</Alert>}
                            
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    {/* Email validation error */}
                                    {errors.email && errors.email.map((error, index) => (
                                        <Alert key={index} variant="danger">{error}</Alert>
                                    ))}
                                </Form.Group>
                                
                                <div className="d-grid">
                                    <Button type="submit" variant="primary">Send Reset Link</Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
