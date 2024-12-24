import React from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

export default function StudentDetailsForm({
    studentDetails,
    handleStudentDetailsChange,
    errors,
}) {
    console.log(errors);
    return (
        <>
            <Row>
                <Col className="mt-3" md={6} sm={12}>
                    <Form.Group as={Col} controlId="formName">
                        <Form.Label>Student Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={studentDetails.name}
                            onChange={handleStudentDetailsChange}
                            placeholder="Enter full name"
                            isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col className="mt-3" md={6} sm={12}>
                    <Form.Group as={Col} controlId="formGender">
                        <Form.Label>Gender</Form.Label>
                        <Form.Select
                            name="gender"
                            value={studentDetails.gender}
                            onChange={handleStudentDetailsChange}
                            isInvalid={!!errors.gender}
                        >
                            <option>Select gender</option>
                            <option value={"male"}>Male</option>
                            <option value={"female"}>Female</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.gender}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col className="mt-3" md={6} sm={12}>
                    <Form.Group as={Col} controlId="formBirthDate">
                        <Form.Label>Birth Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="birth_date"
                            value={studentDetails.birth_date}
                            onChange={handleStudentDetailsChange}
                            placeholder="Select birthday date"
                            isInvalid={!!errors.birth_date}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.birth_date}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col className="mt-3" md={6} sm={12}>
                    <Form.Group as={Col} controlId="formAge">
                        <Form.Label>Age</Form.Label>
                        <Form.Control
                            type="number"
                            name="age"
                            value={studentDetails.age}
                            onChange={handleStudentDetailsChange}
                            placeholder="Age"
                            isInvalid={!!errors.age}
                            readOnly
                            style={{ backgroundColor: "#f0f0f0" }} // Light background for read-only
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.age}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col className="mt-3" md={6} sm={12}>
                    <Form.Group as={Col} controlId="formNationality">
                        <Form.Label>Nationality</Form.Label>
                        <Form.Control
                            type="text"
                            name="nationality"
                            value={studentDetails.nationality}
                            onChange={handleStudentDetailsChange}
                            placeholder="Enter nationality"
                            isInvalid={!!errors.nationality}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.nationality}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col className="mt-3" md={6} sm={12}>
                    <Form.Group as={Col} controlId="formPostalCode">
                        <Form.Label>Postal Code</Form.Label>
                        <Form.Control
                            type="text"
                            name="postal_code"
                            value={studentDetails.postal_code}
                            onChange={handleStudentDetailsChange}
                            placeholder="Enter postal code"
                            isInvalid={!!errors.postal_code}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.postal_code}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row className="mt-3">
                <Form.Group as={Col} controlId="formAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        as="textarea"
                        type="text"
                        name="address"
                        value={studentDetails.address}
                        onChange={handleStudentDetailsChange}
                        placeholder="Enter address"
                        isInvalid={!!errors.address}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.address}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
        </>
    );
}
