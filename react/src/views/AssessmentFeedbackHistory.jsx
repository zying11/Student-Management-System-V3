import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";

import axiosClient from "../axiosClient";
import Button from "../components/Button/Button";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import { Table } from "../components/Table/Table";

export default function AssessmentFeedbackHistory() {
    // Extract the studentId and subjectId from the URL
    const { studentId, subjectId } = useParams();
    const location = useLocation();
    // Get year from URL
    const yearFromUrl = parseInt(
        new URLSearchParams(location.search).get("year")
    );

    const [feedbackDetails, setFeedbackDetails] = useState([]);
    const [studentName, setStudentName] = useState("");
    const [subjectName, setSubjectName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [completedCount, setCompletedCount] = useState(0);

    // Mapping status codes to their text representations
    const statusTextMap = {
        0: "Not Started",
        1: "In Progress",
        2: "Completed",
    };

    useEffect(() => {
        async function fetchDetails() {
            try {
                // Include year from URL in the API request
                const feedbackResponse = await axiosClient.get(
                    `/students/${studentId}/subjects/${subjectId}/feedback?year=${yearFromUrl}`
                );

                const responseData = feedbackResponse.data;
                setFeedbackDetails(responseData.feedback);

                // Count completed feedback
                const countCompleted = responseData.feedback.filter(
                    (feedback) => feedback.status === 2
                ).length;
                setCompletedCount(countCompleted);

                // Fetch student name
                const studentResponse = await axiosClient.get(
                    `/students/${studentId}`
                );
                setStudentName(studentResponse.data.name);

                // Fetch subject name
                const subjectResponse = await axiosClient.get(
                    `/subjects/${subjectId}`
                );
                setSubjectName(subjectResponse.data.subject.subject_name);

                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load feedback details.");
                setLoading(false);
            }
        }

        fetchDetails();
    }, [studentId, subjectId, yearFromUrl]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const tableHeader = ["Month", "Status", "Review Date", "Actions"];
    const tableData = feedbackDetails.map((feedback) => [
        feedback.month || "-",
        statusTextMap[feedback.status] || "-",
        feedback.review_date || "-",
        <Link
            to={`/assessment-feedback/review/student/${studentId}/subject/${subjectId}/feedback/${feedback.id}?year=${yearFromUrl}`}
            key={`review-${feedback.id}`}
        >
            <Button className="btn-create-yellow">Review</Button>
        </Link>,
    ]);

    return (
        <>
            <div className="page-title">Feedback</div>

            <ContentContainer
                title={`Feedback For ${studentName || "Student"}`}
            >
                <div className="mb-3">
                    <p>Subject: {subjectName || "Subject"}</p>
                    <p>Year: {yearFromUrl}</p>
                    <p>Total Completed Feedback: {completedCount}</p>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                {feedbackDetails.length === 0 ? (
                    <div className="no-feedback-message">
                        <p>No feedback available for {yearFromUrl}.</p>
                    </div>
                ) : (
                    <Table
                        header={tableHeader}
                        data={tableData}
                        itemsPerPage={12}
                    />
                )}
            </ContentContainer>
            <div className="d-flex justify-content-end mt-3">
                <Link
                    to="/assessment-feedback"
                    className="text-decoration-none"
                >
                    <Button>Back</Button>
                </Link>
            </div>
        </>
    );
}
