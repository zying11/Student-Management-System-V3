import React, { useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Eye, EyeOff } from "lucide-react";
import { useStateContext } from "../../contexts/ContextProvider";

export default function LoginDetailsForm({
    loginDetails,
    handleLoginChange,
    errors,
    fixedRole,
}) {
    // Access the logged-in user with their role
    const { user } = useStateContext();

    // Check if the logged-in user is a teacher or admin to conditionally set readOnly
    const isReadOnly = user.role_id === 2; // Assuming role_id of 2 is for teacher

    // Add state for password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <>
            <Row>
                <Col className="mt-3" md={6} sm={12}>
                    <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={loginDetails.name}
                            onChange={handleLoginChange}
                            placeholder="Enter full name"
                            isInvalid={!!errors.name}
                            readOnly={isReadOnly} // Read-only for teachers based on their role
                            style={{
                                backgroundColor: isReadOnly
                                    ? "#f0f0f0"
                                    : "white",
                            }} // Light background for read-only
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                {fixedRole ? (
                    <Col className="mt-3" md={6} sm={12}>
                        <Form.Group controlId="formRole">
                            <Form.Label>Role</Form.Label>
                            <Form.Control
                                type="text"
                                value={fixedRole === 1 ? "Admin" : "Teacher"}
                                readOnly
                                style={{ backgroundColor: "#f0f0f0" }} // Light background for read-only
                            />
                        </Form.Group>
                    </Col>
                ) : (
                    <Col className="mt-3" md={6} sm={12}>
                        <Form.Group className="col-5" controlId="formRole">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                name="role_id"
                                value={loginDetails.role_id}
                                onChange={handleLoginChange}
                                isInvalid={!!errors.role_id}
                            >
                                <option>Select role</option>
                                <option value={1}>Admin</option>
                                <option value={2}>Teacher</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.role_id}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                )}
            </Row>

            <Row>
                <Col className="mt-3" md={6} sm={12}>
                    <Form.Group controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={loginDetails.email}
                            onChange={handleLoginChange}
                            placeholder="Enter email address"
                            isInvalid={!!errors.email}
                            readOnly={isReadOnly} // Read-only for teachers based on their role
                            style={{
                                backgroundColor: isReadOnly
                                    ? "#f0f0f0"
                                    : "white",
                            }} // Light background for read-only
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col className="mt-3" md={6} sm={12}>
                    <Form.Group controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <div className="position-relative">
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={loginDetails.password}
                                onChange={handleLoginChange}
                                placeholder="Enter password"
                                isInvalid={!!errors.password}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    border: "none",
                                    background: "none",
                                    cursor: "pointer",
                                    padding: "0 5px",
                                }}
                            >
                                {showPassword ? (
                                    <Eye size={22} className="h-4 w-4 text-gray-500" />
                                ) : (
                                    <EyeOff size={22} className="h-4 w-4 text-gray-500" />
                                )}
                            </button>
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </div>
                    </Form.Group>
                </Col>
                <Col className="mt-3" md={6} sm={12}>
                    <Form.Group controlId="formConfirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <div className="position-relative">
                            <Form.Control
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={loginDetails.confirmPassword}
                                onChange={handleLoginChange}
                                placeholder="Enter confirm password"
                                isInvalid={!!errors.confirmPassword}
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    border: "none",
                                    background: "none",
                                    cursor: "pointer",
                                    padding: "0 5px",
                                }}
                            >
                                {showConfirmPassword ? (
                                    <Eye size={22} className="h-4 w-4 text-gray-500" />
                                ) : (
                                    <EyeOff size={22} className="h-4 w-4 text-gray-500" />
                                )}
                            </button>
                            <Form.Control.Feedback type="invalid">
                                {errors.confirmPassword}
                            </Form.Control.Feedback>
                        </div>
                    </Form.Group>
                </Col>
            </Row>
        </>
    );
}
