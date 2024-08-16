import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/ContextProvider";
import { Form, Button, Alert, InputGroup } from "react-bootstrap";
import { Link } from 'react-router-dom';
import "../css/Login.css";
import "../css/PrimaryButton.css";

export default function Login() {
  // Define state variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [errors, setErrors] = useState('');

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
      axiosClient.post("/login", payload)
        .then(({ data }) => {
          setUser(data.user);
          setToken(data.token);
          navigate('/users');
        })
        .catch(err => {
          // Handle login error
          if (err.response && err.response.data && err.response.data.message) {
            setErrors({ server: err.response.data.message });
          } else {
            setErrors({ server: 'An error occurred. Please try again later.' });
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

  // Function to handle forgot password
  const handlePassword = () => { };

  return (
    <div className="login-form-wrapper">
      <div className="login-form-content">
        <div className="login-form-image-text">
          <img src="/images/login-form-element.png" alt="Logo" className="login-form-image" />
          <p className="login-form-text">Student Management System</p>
        </div>
        <div className="login-form">
          <h3 className="login-form-title text-center">Sign In</h3>
          <Form onSubmit={Submit}>
            {errors.server && <Alert variant="danger">{errors.server}</Alert>}

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                ref={emailRef}
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <Alert variant="danger">{errors.email}</Alert>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                ref={passwordRef}
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <Alert variant="danger">{errors.password}</Alert>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Select
                ref={roleBasedRef}
                aria-label="Select your role"
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select your role</option>
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
              </Form.Select>
              {errors.role && <Alert variant="danger">{errors.role}</Alert>}
            </Form.Group>

            <div className="d-grid">
              <Button type="signin" variant="primary">
                Sign In
              </Button>
            </div>

            <div className="d-grid justify-content-end">
              <Button className="text-muted px-0" variant="link" as={Link} to="/forgot-password">
                Forgot password?
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}