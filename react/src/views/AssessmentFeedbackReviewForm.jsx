import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { Form } from "react-bootstrap";
import Button from "../components/Button/Button";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import { Row, Col } from "react-bootstrap";
import ReactStars from "react-rating-stars-component";

export default function AssessmentFeedbackReviewForm() {
    // extract studentId, subjectId, and feedbackId from the URL
    const { studentId, subjectId, feedbackId } = useParams();
    const navigate = useNavigate();
    
    const [feedbackDetails, setFeedbackDetails] = useState({
        status: "",
        review_date: "",
        topics: [
            {
                topic_name: "",
                competency_level: "",
                class_participation: 0,
                problem_solving: 0,
                assignment_completion: 0,
                communication_skills: 0,
                behavior_discipline: 0,
                effort_motivation: 0,
                comment: "",
            },
        ],
        overall_feedback: "",
        suggestions: "",
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    // Fetch feedback details
    useEffect(() => {
        async function fetchFeedbackDetails() {
            try {
                const res = await axiosClient.get(`/feedback/${feedbackId}`);
                const data = res.data;

                // Ensure topics is an array
                const feedbackWithTopics = {
                    ...data,
                    topics: data.topics || [],
                };

                setFeedbackDetails(feedbackWithTopics);
            } catch (err) {
                console.error("Error fetching feedback details:", err);
                setError("Error fetching feedback details. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        fetchFeedbackDetails();
    }, [feedbackId]);


    const handleFieldChange = (index, field, value) => {
        // Update the specific field in the topics array
        const updatedTopics = [...feedbackDetails.topics];
        updatedTopics[index][field] = value;
        setFeedbackDetails({ ...feedbackDetails, topics: updatedTopics });

        // Clear the error for the specific field the user is typing in
        setValidationErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors };
            delete updatedErrors[`topics.${index}.${field}`]; // Remove the error for the specific field
            return updatedErrors;
        });
    };

    const addNewTopic = () => {
        setFeedbackDetails({
            ...feedbackDetails,
            topics: [
                ...feedbackDetails.topics,
                {
                    topic_name: "",
                    competency_level: "",
                    class_participation: 0,
                    problem_solving: 0,
                    assignment_completion: 0,
                    communication_skills: 0,
                    behavior_discipline: 0,
                    effort_motivation: 0,
                    comment: "",
                },
            ],
        });
    };

    const removeTopic = (index) => {
        const updatedTopics = feedbackDetails.topics.filter(
            (_, i) => i !== index
        );
        setFeedbackDetails({ ...feedbackDetails, topics: updatedTopics });
    };

    const validateForm = () => {
        const errors = {};

        if (!feedbackDetails.status) {
            errors.status = "Status is required.";
        }

        if (!feedbackDetails.review_date) {
            errors.review_date = "Review date is required.";
        }

        feedbackDetails.topics.forEach((topic, index) => {
            if (!topic.topic_name) {
                errors[`topics.${index}.topic_name`] =
                    "Topic name is required.";
            }
            if (!topic.competency_level) {
                errors[`topics.${index}.competency_level`] =
                    "Competency level is required.";
            }
            if (!topic.class_participation) {
                errors[`topics.${index}.class_participation`] =
                    "Class participation is required.";
            }
            if (!topic.problem_solving) {
                errors[`topics.${index}.problem_solving`] =
                    "Problem-solving skills is required.";
            }
            if (!topic.assignment_completion) {
                errors[`topics.${index}.assignment_completion`] =
                    "Assignment completion is required.";
            }
            if (!topic.communication_skills) {
                errors[`topics.${index}.communication_skills`] =
                    "Communication skills is required.";
            }
            if (!topic.behavior_discipline) {
                errors[`topics.${index}.behavior_discipline`] =
                    "Behavior and discipline is required.";
            }
            if (!topic.effort_motivation) {
                errors[`topics.${index}.effort_motivation`] =
                    "Effort and motivation is required.";
            }
            if (!topic.comment) {
                errors[`topics.${index}.comment`] = "Comment is required.";
            }
        });

        if (!feedbackDetails.overall_feedback) {
            errors.overall_feedback = "Overall feedback is required.";
        }

        if (!feedbackDetails.suggestions) {
            errors.suggestions = "Suggestions are required.";
        }

        setValidationErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await axiosClient.put(`/feedback/${feedbackId}`, feedbackDetails);
            alert("Feedback updated successfully!");
            navigate(
                `/assessment-feedback/history/student/${studentId}/subject/${subjectId}`
            );
        } catch (err) {
            setError("Error updating feedback.");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="feedback-details">
            <div className="page-title">Feedback</div>

            {error && <div className="alert alert-danger">{error}</div>}
            <ContentContainer title={`Feedback Details`}>
                <Row className="mb-4">
                    <Col>
                        <p>Student Name: {feedbackDetails.student_name}</p>
                    </Col>
                    <Col>
                        <p>Subject: {feedbackDetails.subject_name}</p>
                    </Col>
                    <Col>
                        <p>Study Level: {feedbackDetails.study_level}</p>
                    </Col>
                    <Col>
                        <p>Month: {feedbackDetails.month} </p>
                    </Col>
                </Row>

                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col>
                            {/* Status */}
                            <Form.Group>
                                <Form.Label>Status</Form.Label>
                                <Form.Select
                                    value={feedbackDetails.status}
                                    onChange={(e) => {
                                        setFeedbackDetails({
                                            ...feedbackDetails,
                                            status: e.target.value,
                                        });

                                        // Clear error when the user starts interacting with the field
                                        setValidationErrors((prevErrors) => ({
                                            ...prevErrors,
                                            status: "",
                                        }));
                                    }}
                                    isInvalid={!!validationErrors.status}
                                >
                                    <option value="0">Not Started</option>
                                    <option value="1">In Progress</option>
                                    <option value="2">Completed</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {validationErrors.status}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col>
                            {/* Review Date */}
                            <Form.Group>
                                <Form.Label>Review Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={feedbackDetails.review_date}
                                    onChange={(e) => {
                                        setFeedbackDetails({
                                            ...feedbackDetails,
                                            review_date: e.target.value,
                                        });

                                        // Clear error when the user starts interacting with the field
                                        setValidationErrors((prevErrors) => ({
                                            ...prevErrors,
                                            review_date: "",
                                        }));
                                    }}
                                    isInvalid={!!validationErrors.review_date}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {validationErrors.review_date}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Topics */}
                    <h5 className="mt-4">Topics</h5>
                    {feedbackDetails.topics?.map((topic, index) => (
                        <React.Fragment key={index}>
                            <h6 className="mt-2">Topic {index + 1}</h6>
                            <Row className="mb-3">
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Topic Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={topic.topic_name}
                                            placeholder="Enter topic name"
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    index,
                                                    "topic_name",
                                                    e.target.value
                                                )
                                            }
                                            isInvalid={
                                                !!validationErrors[
                                                    `topics.${index}.topic_name`
                                                ]
                                            }
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {
                                                validationErrors[
                                                    `topics.${index}.topic_name`
                                                ]
                                            }
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>
                                            Competency Level
                                        </Form.Label>
                                        <Form.Select
                                            value={topic.competency_level}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    index,
                                                    "competency_level",
                                                    e.target.value
                                                )
                                            }
                                            isInvalid={
                                                !!validationErrors[
                                                    `topics.${index}.competency_level`
                                                ]
                                            }
                                        >
                                            <option value="">
                                                Select Competency Level
                                            </option>
                                            <option value="Needs Improvement">
                                                Needs Improvement
                                            </option>
                                            <option value="Satisfactory">
                                                Satisfactory
                                            </option>
                                            <option value="Proficient">
                                                Proficient
                                            </option>
                                            <option value="Mastered">
                                                Mastered
                                            </option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {
                                                validationErrors[
                                                    `topics.${index}.competency_level`
                                                ]
                                            }
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col>
                                    <Form.Group>
                                        <Form.Label>
                                            Class Participation
                                        </Form.Label>
                                        <div
                                            className={
                                                validationErrors[
                                                    `topics.${index}.class_participation`
                                                ]
                                                    ? "is-invalid"
                                                    : ""
                                            }
                                        >
                                            <ReactStars
                                                count={5}
                                                size={34}
                                                value={
                                                    topic.class_participation
                                                }
                                                onChange={(newRating) =>
                                                    handleFieldChange(
                                                        index,
                                                        "class_participation",
                                                        newRating
                                                    )
                                                }
                                            />
                                        </div>
                                        {validationErrors[
                                            `topics.${index}.class_participation`
                                        ] && (
                                            <div className="invalid-feedback">
                                                {
                                                    validationErrors[
                                                        `topics.${index}.class_participation`
                                                    ]
                                                }
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>
                                            Problem-Solving Skills
                                        </Form.Label>
                                        <div
                                            className={
                                                validationErrors[
                                                    `topics.${index}.problem_solving`
                                                ]
                                                    ? "is-invalid"
                                                    : ""
                                            }
                                        >
                                            <ReactStars
                                                count={5}
                                                size={34}
                                                value={topic.problem_solving}
                                                onChange={(newRating) =>
                                                    handleFieldChange(
                                                        index,
                                                        "problem_solving",
                                                        newRating
                                                    )
                                                }
                                            />
                                        </div>
                                        {validationErrors[
                                            `topics.${index}.problem_solving`
                                        ] && (
                                            <div className="invalid-feedback">
                                                {
                                                    validationErrors[
                                                        `topics.${index}.problem_solving`
                                                    ]
                                                }
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col>
                                    <Form.Group>
                                        <Form.Label>
                                            {" "}
                                            Assignment Completion
                                        </Form.Label>
                                        <div
                                            className={
                                                validationErrors[
                                                    `topics.${index}.assignment_completion`
                                                ]
                                                    ? "is-invalid"
                                                    : ""
                                            }
                                        >
                                            <ReactStars
                                                count={5}
                                                size={34}
                                                value={
                                                    topic.assignment_completion
                                                }
                                                onChange={(newRating) =>
                                                    handleFieldChange(
                                                        index,
                                                        "assignment_completion",
                                                        newRating
                                                    )
                                                }
                                            />
                                        </div>
                                        {validationErrors[
                                            `topics.${index}.assignment_completion`
                                        ] && (
                                            <div className="invalid-feedback">
                                                {
                                                    validationErrors[
                                                        `topics.${index}.assignment_completion`
                                                    ]
                                                }
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>
                                            {" "}
                                            Communication Skills
                                        </Form.Label>
                                        <div
                                            className={
                                                validationErrors[
                                                    `topics.${index}.communication_skills`
                                                ]
                                                    ? "is-invalid"
                                                    : ""
                                            }
                                        >
                                            <ReactStars
                                                count={5}
                                                size={34}
                                                value={
                                                    topic.communication_skills
                                                }
                                                onChange={(newRating) =>
                                                    handleFieldChange(
                                                        index,
                                                        "communication_skills",
                                                        newRating
                                                    )
                                                }
                                            />
                                        </div>
                                        {validationErrors[
                                            `topics.${index}.communication_skills`
                                        ] && (
                                            <div className="invalid-feedback">
                                                {
                                                    validationErrors[
                                                        `topics.${index}.communication_skills`
                                                    ]
                                                }
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col>
                                    <Form.Group>
                                        <Form.Label>
                                            {" "}
                                            Behavior and Discipline
                                        </Form.Label>
                                        <div
                                            className={
                                                validationErrors[
                                                    `topics.${index}.behavior_discipline`
                                                ]
                                                    ? "is-invalid"
                                                    : ""
                                            }
                                        >
                                            <ReactStars
                                                count={5}
                                                size={34}
                                                value={
                                                    topic.behavior_discipline
                                                }
                                                onChange={(newRating) =>
                                                    handleFieldChange(
                                                        index,
                                                        "behavior_discipline",
                                                        newRating
                                                    )
                                                }
                                            />
                                        </div>
                                        {validationErrors[
                                            `topics.${index}.behavior_discipline`
                                        ] && (
                                            <div className="invalid-feedback">
                                                {
                                                    validationErrors[
                                                        `topics.${index}.behavior_discipline`
                                                    ]
                                                }
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>
                                            {" "}
                                            Effort and Motivation
                                        </Form.Label>
                                        <div
                                            className={
                                                validationErrors[
                                                    `topics.${index}.effort_motivation`
                                                ]
                                                    ? "is-invalid"
                                                    : ""
                                            }
                                        >
                                            <ReactStars
                                                count={5}
                                                size={34}
                                                value={topic.effort_motivation}
                                                onChange={(newRating) =>
                                                    handleFieldChange(
                                                        index,
                                                        "effort_motivation",
                                                        newRating
                                                    )
                                                }
                                            />
                                        </div>
                                        {validationErrors[
                                            `topics.${index}.effort_motivation`
                                        ] && (
                                            <div className="invalid-feedback">
                                                {
                                                    validationErrors[
                                                        `topics.${index}.effort_motivation`
                                                    ]
                                                }
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col>
                                    <Form.Group>
                                        <Form.Label> Comment</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            value={topic.comment}
                                            placeholder="Enter comments"
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    index,
                                                    "comment",
                                                    e.target.value
                                                )
                                            }
                                            isInvalid={
                                                !!validationErrors[
                                                    `topics.${index}.comment`
                                                ]
                                            }
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {
                                                validationErrors[
                                                    `topics.${index}.comment`
                                                ]
                                            }
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col className="d-flex justify-content-end">
                                    <img
                                        className="ms-2"
                                        src="http://localhost:8000/icon/add.png"
                                        alt="Add"
                                        onClick={addNewTopic}
                                        style={{ cursor: "pointer" }}
                                    />
                                    <img
                                        className="ms-2"
                                        src="http://localhost:8000/icon/delete.png"
                                        alt="Delete"
                                        onClick={() => removeTopic(index)}
                                        style={{ cursor: "pointer" }}
                                    />
                                </Col>
                            </Row>
                        </React.Fragment>
                    ))}

                    {/* Overall Feedback */}
                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label>Overall Feedback</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={feedbackDetails.overall_feedback}
                                onChange={(e) => {
                                    setFeedbackDetails({
                                        ...feedbackDetails,
                                        overall_feedback: e.target.value,
                                    });

                                    // Clear error when the user starts interacting with the field
                                    setValidationErrors((prevErrors) => ({
                                        ...prevErrors,
                                        overall_feedback: "",
                                    }));
                                }}
                                isInvalid={!!validationErrors.overall_feedback}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.overall_feedback}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        {/* Suggestions */}
                        <Form.Group>
                            <Form.Label>Suggestions</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={feedbackDetails.suggestions}
                                onChange={(e) => {
                                    setFeedbackDetails({
                                        ...feedbackDetails,
                                        suggestions: e.target.value,
                                    });

                                    // Clear error when the user starts interacting with the field
                                    setValidationErrors((prevErrors) => ({
                                        ...prevErrors,
                                        suggestions: "",
                                    }));
                                }}
                                isInvalid={!!validationErrors.suggestions}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.suggestions}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    {/* Submit Button */}
                    <Row className="mb-3">
                        <Col className="d-flex justify-content-end">
                            <Button type="submit">Submit</Button>
                        </Col>
                    </Row>
                </Form>
            </ContentContainer>
        </div>
    );
}
