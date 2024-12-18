import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axiosClient";
import Button from "../components/Button/Button";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import { Table } from "../components/Table/Table";
import SearchBar from "../components/SearchBar";
import { useStateContext } from "../contexts/ContextProvider";
import "../css/Invoice.css";

export default function AssessmentFeedback() {
    // Access the logged-in user with their role
    const { user } = useStateContext();

    const [feedbackData, setFeedbackData] = useState({
        feedbacks: [],
        loading: true,
    });
    const [studyLevels, setStudyLevels] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState("");

    // Fetch specific feedbacks
    useEffect(() => {
        const fetchFeedbackList = async () => {
            try {
                let response;
                if (user.role_id === 1) {
                    // Fetch all students if the user is an admin
                    response = await axiosClient.get(
                        "/feedback-list/all-students"
                    );
                } else if (user.role_id === 2) {
                    // Fetch specific teacher's students if the user is a teacher
                    response = await axiosClient.get(
                        `/feedback-list/teacher/user/${user.id}`
                    );
                } else {
                    throw new Error("Unauthorized role");
                }

                setFeedbackData({
                    feedbacks: response.data,
                    loading: false,
                });
            } catch (err) {
                console.error("Error fetching feedback list:", err);
                setError("Failed to fetch feedback data. Please try again.");
                setFeedbackData({ feedbacks: [], loading: false });
            }
        };

        if (user && user.role_id) {
            fetchFeedbackList();
        }
    }, [user]);

    // Fetch study levels
    useEffect(() => {
        const fetchStudyLevels = async () => {
            try {
                const response = await axiosClient.get(`/study-levels`);
                setStudyLevels(response.data.studyLevels || []);
            } catch (error) {
                console.error("Error fetching study levels:", error);
                setError("Failed to fetch study levels. Please try again.");
            }
        };

        fetchStudyLevels();
    }, []);

    // Create a lookup object for level names
    const levelLookup = studyLevels.reduce((acc, level) => {
        acc[level.id] = level.level_name;
        return acc;
    }, {});

    // Filter feedbacks by name based on search query and avoid duplicates
    const filteredFeedbacks = feedbackData.feedbacks
        .filter((feedback) =>
            feedback.name
                .toLowerCase()
                .includes(searchQuery.trim().toLowerCase())
        )
        .map((feedback) => {
            // Deduplicate the feedback array by subject name
            const uniqueFeedback = [
                ...new Map(
                    feedback.feedback.map((subFeedback) => [
                        subFeedback.subject.subject_name,
                        subFeedback,
                    ])
                ).values(),
            ];

            return {
                ...feedback,
                feedback: uniqueFeedback, // Replace the feedback array with unique subjects
            };
        });

    const tableHeader = [
        "ID",
        "Student Name",
        "Study Level",
        "Subject",
        "Feedback Status",
        "Actions",
    ];

    const tableData = feedbackData.loading
        ? [
              [
                  <td key="loading" colSpan="6" className="text-center">
                      Loading...
                  </td>,
              ],
          ]
        : filteredFeedbacks.flatMap((feedback) =>
              feedback.feedback?.map((subjectFeedback) => [
                  feedback.id || "-", // Student ID
                  feedback.name || "-", // Student Name
                  levelLookup[subjectFeedback.subject.level_id] || "-",
                  subjectFeedback.subject.subject_name || "-",
                  `${subjectFeedback.status}/12 Completed`,
                  <Link
                      to={`/assessment-feedback/history/student/${feedback.id}/subject/${subjectFeedback.subject_id}`} // feedback.id is the student ID
                      className="text-decoration-none"
                  >
                      <Button className="btn-create-yellow">
                          View Details
                      </Button>
                  </Link>,
              ])
          );

    return (
        <>
            <div className="page-title">Feedback</div>

            {/* Display assessment list table */}
            <ContentContainer title="Assessment Feedback List">
                {/* Search by student name */}
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    placeholder="Search student by name"
                />

                {error && <div className="alert alert-danger">{error}</div>}
                <Table
                    header={tableHeader}
                    data={tableData}
                    itemsPerPage={10}
                />
            </ContentContainer>
        </>
    );
}