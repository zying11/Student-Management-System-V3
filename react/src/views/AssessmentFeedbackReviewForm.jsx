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
                class_participation: "",
                problem_solving: "",
                assignment_completion: "",
                communication_skills: "",
                behavior_discipline: "",
                effort_motivation: "",
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

    // const validateFields = () => {
    //     const errors = {};

    //     // Validate topics
    //     feedbackDetails.topics.forEach((topic, index) => {
    //         if (!topic.topic_name.trim()) {
    //             errors[`topics.${index}.topic_name`] =
    //                 "Topic name is required.";
    //         }
    //         if (!topic.competency_level) {
    //             errors[`topics.${index}.competency_level`] =
    //                 "Competency level is required.";
    //         }
    //         if (topic.class_participation < 1) {
    //             errors[`topics.${index}.class_participation`] =
    //                 "Class participation rating is required.";
    //         }
    //         if (topic.problem_solving < 1) {
    //             errors[`topics.${index}.problem_solving`] =
    //                 "Problem-solving rating is required.";
    //         }

    //     });

    //     // Validate overall feedback and suggestions
    //     if (!feedbackDetails.overall_feedback.trim()) {
    //         errors.overall_feedback = "Overall feedback is required.";
    //     }
    //     if (!feedbackDetails.suggestions.trim()) {
    //         errors.suggestions = "Suggestions are required.";
    //     }

    //     setValidationErrors(errors);

    //     // Return true if no errors
    //     return Object.keys(errors).length === 0;
    // };

    const handleFieldChange = (index, field, value) => {
        const updatedTopics = [...feedbackDetails.topics];
        updatedTopics[index][field] = value;
        setFeedbackDetails({ ...feedbackDetails, topics: updatedTopics });

        // Remove validation error for the field if it becomes valid
        const fieldKey = `topics.${index}.${field}`;
        if (validationErrors[fieldKey]) {
            const newErrors = { ...validationErrors };
            delete newErrors[fieldKey];
            setValidationErrors(newErrors);
        }
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure topics array has at least one topic
        if (feedbackDetails.topics.length === 0) {
            setError("Please add at least one topic.");
            return;
        }

        try {
            // API call to save the feedback details
            const response = await axiosClient.put(
                `/feedback/${feedbackId}`,
                feedbackDetails
            );

            // Handle success
            alert("Feedback updated successfully!");

            // Optionally reset error state
            setError("");

            // navigate to feedback history page
            navigate(
                `/assessment-feedback/history/student/${studentId}/subject/${subjectId}`
            );
        } catch (err) {
            console.error("Error updating feedback:", err);

            // Handle validation or server-side errors
            if (err.response && err.response.data) {
                // Display specific backend validation errors
                setError(
                    err.response.data.message || "Error updating feedback."
                );
            } else {
                // General error
                setError("Error updating feedback. Please try again.");
            }
        }
    };

    if (loading) {
        return <div>Loading feedback details...</div>;
    }

    return (
        <div className="feedback-details">
            <div className="page-title">Feedback</div>

            {error && <div className="alert alert-danger">{error}</div>}
            <ContentContainer title={`Feedback Details`}>
                <Row>
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
                    <Row className="mt-4">
                        <Col>
                            {/* Status */}
                            <Form.Group>
                                <Form.Label>Status</Form.Label>
                                <Form.Select
                                    value={feedbackDetails.status}
                                    onChange={(e) =>
                                        setFeedbackDetails({
                                            ...feedbackDetails,
                                            status: e.target.value,
                                        })
                                    }
                                >
                                    <option>Select Feedback Status</option>
                                    <option value="0">Not Started</option>
                                    <option value="1">In Progress</option>
                                    <option value="2">Completed</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col>
                            {/* Review Date */}
                            <Form.Group>
                                <Form.Label>Review Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={feedbackDetails.review_date}
                                    onChange={(e) =>
                                        setFeedbackDetails({
                                            ...feedbackDetails,
                                            review_date: e.target.value,
                                        })
                                    }
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Topics */}
                    <h5 className="mt-4">Topics</h5>
                    {feedbackDetails.topics.map((topic, index) => (
                        <div key={index} className="topic-section mb-3">
                            <h6 className="mt-2">Topic {index + 1}</h6>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Topic</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter topic name"
                                            value={topic.topic_name}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    index,
                                                    "topic_name",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label className="mt-2">
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
                                        >
                                            <option>
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
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label className="mt-2">
                                            Class Participation
                                        </Form.Label>
                                        <ReactStars
                                            count={5}
                                            size={34}
                                            value={topic.class_participation}
                                            onChange={(newRating) =>
                                                handleFieldChange(
                                                    index,
                                                    "class_participation",
                                                    newRating
                                                )
                                            }
                                            activeColor="#ffd700"
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label className="mt-2">
                                            Problem-Solving Skills
                                        </Form.Label>
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
                                            activeColor="#ffd700"
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label className="mt-2">
                                            Assignment Completion
                                        </Form.Label>
                                        <ReactStars
                                            count={5}
                                            size={34}
                                            value={topic.assignment_completion}
                                            onChange={(newRating) =>
                                                handleFieldChange(
                                                    index,
                                                    "assignment_completion",
                                                    newRating
                                                )
                                            }
                                            activeColor="#ffd700"
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label className="mt-2">
                                            Communication Skills
                                        </Form.Label>
                                        <ReactStars
                                            count={5}
                                            size={34}
                                            value={topic.communication_skills}
                                            onChange={(newRating) =>
                                                handleFieldChange(
                                                    index,
                                                    "communication_skills",
                                                    newRating
                                                )
                                            }
                                            activeColor="#ffd700"
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label className="mt-2">
                                            Behavior and Discipline
                                        </Form.Label>
                                        <ReactStars
                                            count={5}
                                            size={34}
                                            value={topic.behavior_discipline}
                                            onChange={(newRating) =>
                                                handleFieldChange(
                                                    index,
                                                    "behavior_discipline",
                                                    newRating
                                                )
                                            }
                                            activeColor="#ffd700"
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label className="mt-2">
                                            Effort and Motivation
                                        </Form.Label>
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
                                            activeColor="#ffd700"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group>
                                <Form.Label>Comment</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter comments"
                                    value={topic.comment}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            index,
                                            "comment",
                                            e.target.value
                                        )
                                    }
                                />
                            </Form.Group>
                            <Button
                                className="mt-2"
                                onClick={() => removeTopic(index)}
                            >
                                Remove Topic
                            </Button>
                        </div>
                    ))}

                    <Button onClick={addNewTopic} className="btn-create-yellow">
                        Add Topic
                    </Button>

                    {/* Overall Feedback */}
                    <Form.Group>
                        <Form.Label>Overall Feedback</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter overall feedback"
                            value={feedbackDetails.overall_feedback}
                            onChange={(e) =>
                                setFeedbackDetails({
                                    ...feedbackDetails,
                                    overall_feedback: e.target.value,
                                })
                            }
                        />
                    </Form.Group>

                    {/* Suggestions */}
                    <Form.Group>
                        <Form.Label>Suggestions</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter suggestions"
                            value={feedbackDetails.suggestions}
                            onChange={(e) =>
                                setFeedbackDetails({
                                    ...feedbackDetails,
                                    suggestions: e.target.value,
                                })
                            }
                        />
                    </Form.Group>

                    {/* Submit Button */}
                    <Button type="submit" className="mt-3">
                        Save Feedback
                    </Button>
                </Form>
            </ContentContainer>
        </div>
    );
}
