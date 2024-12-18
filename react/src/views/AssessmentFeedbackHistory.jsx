import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../axiosClient";
import Button from "../components/Button/Button";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import { Table } from "../components/Table/Table";
import "../css/Invoice.css";

export default function AssessmentFeedbackHistory() {
    // Extract the studentId and subjectId from the URL
    const { studentId, subjectId } = useParams();

    const [feedbackDetails, setFeedbackDetails] = useState([]);
    const [studentName, setStudentName] = useState("");
    const [subjectName, setSubjectName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchDetails() {
            try {
                // Fetch feedback details
                const feedbackResponse = await axiosClient.get(
                    `/students/${studentId}/subjects/${subjectId}/feedback`
                );
                setFeedbackDetails(feedbackResponse.data.feedback);

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
    }, [studentId, subjectId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const tableHeader = ["Month", "Status", "Review Date", "Actions"];
    const tableData = feedbackDetails.map((feedback) => [
        feedback.month || "-",
        feedback.status ? "Completed" : "Pending",
        feedback.review_date || "-",
        <Link
            to={`/assessment-feedback/review/student/${studentId}/subject/${subjectId}/feedback/${feedback.id}`}
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
                <p>Subject: {subjectName || "Subject"}</p>
                {error && <div className="alert alert-danger">{error}</div>}
                <Table
                    header={tableHeader}
                    data={tableData}
                    itemsPerPage={12}
                />
            </ContentContainer>
        </>
    );
}
