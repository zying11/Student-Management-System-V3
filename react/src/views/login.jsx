import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/ContextProvider";
import { Form, Alert, Col } from "react-bootstrap";
import Button from "../components/Button/Button";
import "../css/Login.css";

export default function Login() {
    // Define state variables
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [errors, setErrors] = useState("");

    // Create references for input elements
    const emailRef = useRef();
    const passwordRef = useRef();
    const roleBasedRef = useRef();

    // Destructure setUser and setToken from the state context
    const { setUser, setToken } = useStateContext();

    // Get navigate function from react-router-dom
    const navigate = useNavigate();

    // Function to handle form submission
    const Submit = (ev) => {
        ev.preventDefault();

        // Validate input fields
        const validationErrors = validate();
        setErrors(validationErrors);

        // If no validation errors, proceed with login
        if (Object.keys(validationErrors).length === 0) {
            const payload = {
                email: emailRef.current.value,
                password: passwordRef.current.value,
                role: roleBasedRef.current.value,
            };

            // Send login request to server
            axiosClient
                .post("/login", payload)
                .then(({ data }) => {
                    // Set user and token in context
                    setUser(data.user);
                    setToken(data.token);

                    // Redirect to admin page
                    navigate("/admin");
                })
                .catch((err) => {
                    // Handle login error
                    if (
                        err.response &&
                        err.response.data &&
                        err.response.data.message
                    ) {
                        setErrors({ server: err.response.data.message });
                    } else {
                        setErrors({
                            server: "An error occurred. Please try again later.",
                        });
                    }
                });
        }
    };

    // Function to validate input fields
    const validate = () => {
        const error = {};

        // Validate email
        if (!email) {
            error.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            error.email = "Please use the correct email format";
        }

        // Validate password
        if (!password) {
            error.password = "Password is required";
        } else if (password.length < 8) {
            error.password = "Password length must be at least 8 characters";
        }

        // Validate role
        if (!role) {
            error.role = "Role is required";
        }

        return error;
    };

    // Function to clear the specific error when the user starts typing
    const clearError = (field) => {
        setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    };

    return (
        <div className="login-form-container box-area row p-3">
            <div className="left-box col-md-6">
                <img
                    src="http://localhost:8000/images/login-form-element.png"
                    alt="Login illustration"
                    className="login-illustration"
                />
                <small className="login-illustration-text text-center mt-3">
                    Student Management System
                </small>
            </div>
            <div className="right-box col-md-6">
                <div className="row align-items-center">
                    <h2 className="login-form-title text-center mb-4">
                        Sign In
                    </h2>
                    <Form onSubmit={Submit}>
                        {errors.server && (
                            <Alert variant="danger">{errors.server}</Alert>
                        )}

                        <Form.Group className="mb-3" as={Col} controlId="formEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                ref={emailRef}
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    clearError("email");
                                }}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" as={Col} controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                ref={passwordRef}
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    clearError("password");
                                }}
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-4" as={Col} controlId="formRole">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                ref={roleBasedRef}
                                aria-label="Select your role"
                                value={role}
                                onChange={(e) => {
                                    setRole(e.target.value);
                                    clearError("role");
                                }}
                                isInvalid={!!errors.role}
                            >
                                <option value="">Select your role</option>
                                <option value="admin">Admin</option>
                                <option value="teacher">Teacher</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.role}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <div className="d-grid mb-1">
                            <Button
                                className="btn-create-yellow"
                                type="signin"
                                variant="primary"
                            >
                                Sign In
                            </Button>
                        </div>

                        <div className="d-grid justify-content-center">
                            <Link
                                to="/forgot-password"
                                className="text-decoration-none"
                            >
                                <Button className="link-button" color="">
                                    Forgot password?
                                </Button>
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}
