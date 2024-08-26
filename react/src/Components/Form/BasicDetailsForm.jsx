import React from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

export default function BasicDetailsForm({ basicDetails, handleBasicDetailsChange, errors }) {
    return (
        <>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="formPhoneNumber">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                        type="text"
                        name="phone_number"
                        value={basicDetails.phone_number}
                        onChange={handleBasicDetailsChange}
                        placeholder="Enter phone number"
                        isInvalid={!!errors.phone_number}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.phone_number}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} controlId="formGender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                        name="gender"
                        value={basicDetails.gender}
                        onChange={handleBasicDetailsChange}
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

                <Form.Group as={Col} controlId="formBirthDate">
                    <Form.Label>Birth Date</Form.Label>
                    <Form.Control
                        type="date"
                        name="birth_date"
                        value={basicDetails.birth_date}
                        onChange={handleBasicDetailsChange}
                        placeholder="Select birthday date"
                        isInvalid={!!errors.birth_date}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.birth_date}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} controlId="formAge">
                    <Form.Label>Age</Form.Label>
                    <Form.Control
                        type="number"
                        name="age"
                        value={basicDetails.age}
                        onChange={handleBasicDetailsChange}
                        placeholder="Age"
                        isInvalid={!!errors.age}
                        readOnly
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.age}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>

            <Row className="mb-3">
                <Form.Group as={Col} controlId="formNationality">
                    <Form.Label>Nationality</Form.Label>
                    <Form.Control
                        type="text"
                        name="nationality"
                        value={basicDetails.nationality}
                        onChange={handleBasicDetailsChange}
                        placeholder="Enter nationality"
                        isInvalid={!!errors.nationality}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.nationality}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} controlId="formPostalCode">
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                        type="text"
                        name="postal_code"
                        value={basicDetails.postal_code}
                        onChange={handleBasicDetailsChange}
                        placeholder="Enter postal code"
                        isInvalid={!!errors.postal_code}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.postal_code}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>

            <Row className="mb-3">
                <Form.Group as={Col} controlId="formAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        as="textarea"
                        type="text"
                        name="address"
                        value={basicDetails.address}
                        onChange={handleBasicDetailsChange}
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
