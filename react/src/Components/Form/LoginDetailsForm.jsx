import React from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

export default function LoginDetailsForm({ loginDetails, handleLoginChange, errors, fixedRole }) {
    return (
        <>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={loginDetails.name}
                        onChange={handleLoginChange}
                        placeholder="Enter full name"
                        isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.name}
                    </Form.Control.Feedback>
                </Form.Group>

                {fixedRole ? (
                    <Form.Group as={Col} className="col-5" controlId="formRole">
                        <Form.Label>Role</Form.Label>
                        <Form.Control
                            type="text"
                            value={fixedRole === 1 ? "Admin" : "Teacher"}
                            readOnly
                        />
                    </Form.Group>
                ) : (
                    <Form.Group as={Col} className="col-5" controlId="formRole">
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
                )}
            </Row>

            <Row className="mb-3">
                <Form.Group as={Col} controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={loginDetails.email}
                        onChange={handleLoginChange}
                        placeholder="Enter email address"
                        isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.email}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={loginDetails.password}
                        onChange={handleLoginChange}
                        placeholder="Enter password"
                        isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.password}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} controlId="formConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={loginDetails.confirmPassword}
                        onChange={handleLoginChange}
                        placeholder="Enter confirm password"
                        isInvalid={!!errors.confirmPassword}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
        </>
    );
}
