import React, { useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";

export default function ParentDetailsForm({
    parentDetails,
    handleParentDetailsChange,
    addParent,
    removeParent,
    errors,
}) {
    // Ensure there's at least one parent detail field on initial render
    useEffect(() => {
        // If there are no parent details, add one
        if (parentDetails.length === 0) {
            addParent();
        }
    }, [parentDetails, addParent]);

    return (
        <>
            <Form.Group controlId="parents">
                {parentDetails.map((parent, index) => (
                    <React.Fragment key={index}>
                        {/* Row for Parent Name and Relationship */}
                        <Row>
                            <Col className="mt-3" md={6} sm={12}>
                                <Form.Group>
                                    <Form.Label>Parent Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter parent name"
                                        value={parent.name}
                                        onChange={(e) =>
                                            handleParentDetailsChange(
                                                e,
                                                index,
                                                "name"
                                            )
                                        }
                                        isInvalid={
                                            !!errors[`parent_name_${index}`]
                                        }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors[`parent_name_${index}`] ? (
                                            <p className="error-message">
                                                {errors[`parent_name_${index}`]}
                                            </p>
                                        ) : null}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col className="mt-3" md={6} sm={12}>
                                <Form.Group>
                                    <Form.Label>Relationship</Form.Label>
                                    <Form.Select
                                        value={parent.relationship}
                                        onChange={(e) =>
                                            handleParentDetailsChange(
                                                e,
                                                index,
                                                "relationship"
                                            )
                                        }
                                        isInvalid={
                                            !!errors[
                                                `parent_relationship_${index}`
                                            ]
                                        }
                                    >
                                        <option value="">
                                            Select relationship
                                        </option>
                                        <option value="Father">Father</option>
                                        <option value="Mother">Mother</option>
                                        <option value="Guardian">
                                            Guardian
                                        </option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors[
                                            `parent_relationship_${index}`
                                        ] ? (
                                            <p className="error-message">
                                                {
                                                    errors[
                                                        `parent_relationship_${index}`
                                                    ]
                                                }
                                            </p>
                                        ) : null}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Row for Email and Phone Number */}
                        <Row>
                            <Col className="mt-3" md={6} sm={12}>
                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        value={parent.email}
                                        onChange={(e) =>
                                            handleParentDetailsChange(
                                                e,
                                                index,
                                                "email"
                                            )
                                        }
                                        isInvalid={
                                            !!errors[`parent_email_${index}`]
                                        }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors[`parent_email_${index}`] ? (
                                            <p className="error-message">
                                                {
                                                    errors[
                                                        `parent_email_${index}`
                                                    ]
                                                }
                                            </p>
                                        ) : null}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col className="mt-3" md={6} sm={12}>
                                <Form.Group>
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter phone number"
                                        value={parent.phone_number}
                                        onChange={(e) =>
                                            handleParentDetailsChange(
                                                e,
                                                index,
                                                "phone_number"
                                            )
                                        }
                                        isInvalid={
                                            !!errors[`parent_phone_${index}`]
                                        }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors[`parent_phone_${index}`] ? (
                                            <p className="error-message">
                                                {
                                                    errors[
                                                        `parent_phone_${index}`
                                                    ]
                                                }
                                            </p>
                                        ) : null}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Row for Add and Remove Buttons */}
                        <Row className="mt-3">
                            <Col className="d-flex justify-content-end">
                                <img
                                    className="ms-2"
                                    src="/icon/add.png"
                                    alt="Add"
                                    onClick={addParent}
                                    style={{ cursor: "pointer" }}
                                />
                                <img
                                    className="ms-2"
                                    src="/icon/delete.png"
                                    alt="Delete"
                                    onClick={() => removeParent(index)}
                                    style={{ cursor: "pointer" }}
                                />
                            </Col>
                        </Row>
                    </React.Fragment>
                ))}
            </Form.Group>
        </>
    );
}
