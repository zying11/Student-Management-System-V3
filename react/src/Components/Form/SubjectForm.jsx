import React, { useEffect } from 'react';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";

export default function SubjectForm({ availableSubjects, selectedSubjects, handleSubjectChange, addSubject, removeSubject, errors }) {
    // Ensure there's at least one subject input field on initial render
    useEffect(() => {
        // If there are no selected subjects, add one
        if (selectedSubjects.length === 0) {
            // Call the addSubject function to add a new subject input field
            addSubject();
        }
    }, [selectedSubjects, addSubject]);

    // Render the subject input fields
    return (
        <>
            <Form.Group controlId="subjects">
                <Form.Label>Subject</Form.Label>
                {selectedSubjects.map((subject, index) => (
                    <Row className="mb-3" key={index}>
                        <Form.Group as={Col} key={index} className="mb-3 col-10">
                            <Form.Control
                                as="select"
                                value={subject}
                                onChange={(e) => handleSubjectChange(e, index)}
                                isInvalid={!!errors.subject_ids}
                            >
                                <option value="">Select Subject</option>
                                {availableSubjects.map((subj) => (
                                    <option key={subj.id} value={subj.id}>
                                        {subj.subject_name}
                                    </option>
                                ))}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.subject_ids && <p className="error-message">{errors.subject_ids}</p>}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} className="mb-3 d-flex align-items-start ">
                            <img
                                className="ms-2"
                                src="/icon/add.png"
                                alt="Add"
                                onClick={addSubject}
                                style={{ cursor: "pointer" }} />

                            <img
                                className="ms-2"
                                src="/icon/delete.png"
                                alt="Delete"
                                onClick={() => removeSubject(index)}
                                style={{ cursor: "pointer" }} />
                        </Form.Group>
                    </Row>

                ))}
            </Form.Group>
        </>
    );
}