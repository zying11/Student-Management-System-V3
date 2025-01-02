import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import axiosClient from "../axiosClient";
import { Form } from "react-bootstrap";
import Button from "../components/Button/Button";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import { Row, Col } from "react-bootstrap";
import { Rating } from "react-simple-star-rating";
import jsPDF from "jspdf";

export default function AssessmentFeedbackReviewForm() {
    const location = useLocation();
    const selectedYear = new URLSearchParams(location.search).get("year");

    // extract studentId, subjectId, and feedbackId from the URL
    const { studentId, subjectId, feedbackId } = useParams();
    const navigate = useNavigate();

    // Track whether the form is saved
    const [isSaved, setIsSaved] = useState(false);

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

    const [studentDetails, setStudentDetails] = useState({});

    const [validationErrors, setValidationErrors] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const [center, setCenter] = useState({});

    // Fetch center data
    useEffect(() => {
        async function fetchCenterProfile() {
            try {
                const res = await axiosClient.get(`/center-profile`);
                setCenter(res.data.centerProfile[0]);
            } catch (err) {
                console.error("Error fetching center profile data:", err);
                setError(
                    "Error fetching center profile data. Please try again."
                );
            } finally {
                setLoading(false);
            }
        }

        fetchCenterProfile();
    }, []);

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

    // Fetch student data
    useEffect(() => {
        async function fetchStudentDetails() {
            try {
                const res = await axiosClient.get(`/students/${studentId}`);
                setStudentDetails(res.data);
            } catch (err) {
                console.error("Error fetching student details:", err);
                setError("Error fetching student details. Please try again.");
            }
        }

        fetchStudentDetails();
    }, [studentId]);

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
        // Ensure this works for both manual calls and form events
        if (e) e.preventDefault();

        if (!validateForm()) {
            return false;
        }

        try {
            await axiosClient.put(`/feedback/${feedbackId}`, feedbackDetails);
            // Mark the form as saved
            setIsSaved(true);
            alert("Feedback updated successfully!");
            navigate(
                `/assessment-feedback/history/student/${studentId}/subject/${subjectId}?year=${selectedYear}`
            );
            return true;
        } catch (err) {
            setError("Error updating feedback.");
            return false;
        }
    };

    // Function to handle sending the review form (Send PDF via email)
    const handleSendReviewForm = async (
        studentDetails,
        feedbackDetails,
        center
    ) => {
        // Check if the form is saved
        if (!isSaved) {
            // Save the form first
            const saveSuccess = await handleSubmit();
            if (!saveSuccess) {
                // If save failed, stop the process
                alert("Please save the form before sending.");
                return;
            }
        }

        const parentEmails =
            studentDetails?.parents?.map((parent) => parent.email) || [];

        if (parentEmails.length === 0) {
            alert("No parent emails found!");
            return;
        }

        try {
            const doc = new jsPDF();

            // Document Title
            doc.setFontSize(18);
            doc.text(`${center.center_name || "Tuition Center"}`, 10, 10);

            // Review Form and Student Details
            doc.setFontSize(12);
            doc.text(`Student Name: ${studentDetails.name}`, 10, 20);
            doc.text(`Subject: ${feedbackDetails.subject_name}`, 10, 30);
            doc.text(`Study Level: ${feedbackDetails.study_level}`, 10, 40);
            doc.text(`Month: ${feedbackDetails.month} ${selectedYear}`, 10, 50);
            doc.text(`Review Date: ${feedbackDetails.review_date}`, 10, 60);

            // Topics Table
            doc.autoTable({
                startY: 70,
                head: [
                    [
                        "#",
                        "Topic Name",
                        "Competency Level",
                        "Class Participation",
                        "Problem-Solving Skills",
                        "Assignment Completion",
                        "Communication Skills",
                        "Behavior and Discipline",
                        "Effort and Motivation",
                        "Comment",
                    ],
                ],
                body: feedbackDetails.topics.map((topic, index) => [
                    index + 1,
                    topic.topic_name,
                    topic.competency_level,
                    topic.class_participation,
                    topic.problem_solving,
                    topic.assignment_completion,
                    topic.communication_skills,
                    topic.behavior_discipline,
                    topic.effort_motivation,
                    topic.comment,
                ]),
            });

            // Overall Feedback and Suggestions
            // Calculate where to place after the table
            const finalY = doc.previousAutoTable.finalY + 10;

            doc.text(
                `Overall Feedback: ${feedbackDetails.overall_feedback}`,
                10,
                finalY + 10
            );
            doc.text(
                `Suggestions: ${feedbackDetails.suggestions}`,
                10,
                finalY + 20
            );

            // Convert the PDF to Blob
            const pdfBlob = doc.output("blob");

            // Create FormData to send the PDF
            const formData = new FormData();
            // Append each email
            parentEmails.forEach((email) => formData.append("emails[]", email));
            // Attach the PDF
            formData.append("pdf", pdfBlob, "review-form.pdf");

            const response = await axiosClient.post(
                "/send-review-form-pdf-email",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            alert("Review form sent to all parent emails!");
        } catch (error) {
            console.error("Error sending review form:", error);
            alert("Failed to send review form.");
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
                <div className="d-flex justify-content-end mt-3">
                    <Row className="mb-3">
                        <Col xs="auto">
                            {/* Send Button */}
                            <Button
                                className="btn-create-yellow-border"
                                onClick={() =>
                                    handleSendReviewForm(
                                        studentDetails,
                                        feedbackDetails,
                                        center
                                    )
                                }
                                disabled={loading}
                            >
                                <i className="fas fa-print me-1"></i>{" "}
                                {loading ? "Sending..." : "Send"}
                            </Button>
                        </Col>
                    </Row>
                </div>

                <Row className="mb-4">
                    <Col xs="12" md="6" lg="3">
                        <p>Student Name: {feedbackDetails.student_name}</p>
                    </Col>
                    <Col xs="12" md="6" lg="3">
                        <p>Subject: {feedbackDetails.subject_name}</p>
                    </Col>
                    <Col xs="12" md="6" lg="3">
                        <p>Study Level: {feedbackDetails.study_level}</p>
                    </Col>
                    <Col xs="12" md="6" lg="3">
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

                        <Col xs="12" md="6">
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
                                    min={`${selectedYear}-01-01`} // Start of the selected year
                                    max={`${selectedYear}-12-31`} // End of the selected year
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
                                <Col xs="12" md="6">
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
                                <Col xs="12" md="6">
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
                                <Col xs="12" md="6">
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
                                            <Rating
                                                size={34}
                                                initialValue={
                                                    topic.class_participation
                                                }
                                                onClick={(newRating) =>
                                                    handleFieldChange(
                                                        index,
                                                        "class_participation",
                                                        newRating
                                                    )
                                                }
                                                fillColor="#f5aa39"
                                                emptyColor="#ccc"
                                                allowHover
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
                                <Col xs="12" md="6">
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
                                            <Rating
                                                size={34}
                                                initialValue={
                                                    topic.problem_solving
                                                }
                                                onClick={(newRating) =>
                                                    handleFieldChange(
                                                        index,
                                                        "problem_solving",
                                                        newRating
                                                    )
                                                }
                                                fillColor="#f5aa39"
                                                emptyColor="#ccc"
                                                allowHover
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
                                <Col xs="12" md="6">
                                    <Form.Group>
                                        <Form.Label>
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
                                            <Rating
                                                size={34}
                                                initialValue={
                                                    topic.assignment_completion
                                                }
                                                onClick={(newRating) =>
                                                    handleFieldChange(
                                                        index,
                                                        "assignment_completion",
                                                        newRating
                                                    )
                                                }
                                                fillColor="#f5aa39"
                                                emptyColor="#ccc"
                                                allowHover
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
                                <Col xs="12" md="6">
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
                                            <Rating
                                                size={34}
                                                initialValue={
                                                    topic.communication_skills
                                                }
                                                onClick={(newRating) =>
                                                    handleFieldChange(
                                                        index,
                                                        "communication_skills",
                                                        newRating
                                                    )
                                                }
                                                fillColor="#f5aa39"
                                                emptyColor="#ccc"
                                                allowHover
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
                                <Col xs="12" md="6">
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
                                            <Rating
                                                size={34}
                                                initialValue={
                                                    topic.behavior_discipline
                                                }
                                                onClick={(newRating) =>
                                                    handleFieldChange(
                                                        index,
                                                        "behavior_discipline",
                                                        newRating
                                                    )
                                                }
                                                fillColor="#f5aa39"
                                                emptyColor="#ccc"
                                                allowHover
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
                                <Col xs="12" md="6">
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
                                            <Rating
                                                size={34}
                                                initialValue={
                                                    topic.effort_motivation
                                                }
                                                onClick={(newRating) =>
                                                    handleFieldChange(
                                                        index,
                                                        "effort_motivation",
                                                        newRating
                                                    )
                                                }
                                                fillColor="#f5aa39"
                                                emptyColor="#ccc"
                                                allowHover
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
                                <Col xs="12" md="6">
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
                                        src="/icon/add.png"
                                        alt="Add"
                                        onClick={addNewTopic}
                                        style={{ cursor: "pointer" }}
                                    />
                                    <img
                                        className="ms-2"
                                        src="/icon/delete.png"
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

                    <div className="d-flex justify-content-end mt-3">
                        <Row className="mb-3">
                            <Col>
                                {/* Back Button */}
                                <Link
                                    to={`/assessment-feedback/history/student/${studentId}/subject/${subjectId}?year=${selectedYear}`}
                                    className="text-decoration-none"
                                >
                                    <Button className="btn-create-yellow">
                                        Back
                                    </Button>
                                </Link>
                            </Col>

                            <Col>
                                {/* Submit Button */}
                                <Button type="submit">Submit</Button>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </ContentContainer>
        </div>
    );
}
