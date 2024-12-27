import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axiosClient";
import Button from "../components/Button/Button";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import { Table } from "../components/Table/Table";
import SearchBar from "../components/SearchBar";
import { useStateContext } from "../contexts/ContextProvider";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to the current year

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        // Check initial screen size
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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

    // Calculate completion status for a subject's feedback
    const calculateCompletionStatus = (feedbackArray) => {
        // Count completed feedbacks (status === 2)
        const completedCount = feedbackArray.filter(
            (feedback) => feedback.status === 2
        ).length;

        // Total should be 12 months
        return `${completedCount}/12 Completed`;
    };

    // Filter feedbacks by student name, year of creation and organize by subject
    const filteredFeedbacks = feedbackData.feedbacks
        .filter((feedback) => {
            // Filter by student name search query
            return feedback.name
                .toLowerCase()
                .includes(searchQuery.trim().toLowerCase());
        })
        .filter((feedback) => {
            // Filter by student creation year
            const studentYear = new Date(feedback.created_at).getFullYear(); // Assuming feedback has created_at
            return studentYear === selectedYear;
        })
        .map((feedback) => {
            // Group feedbacks by subject and level
            const subjectGroups = feedback.feedback.reduce((acc, curr) => {
                const key = `${curr.subject.id}-${curr.subject.level_id}`;
                if (!acc[key]) {
                    acc[key] = {
                        subject: curr.subject,
                        feedbacks: [],
                    };
                }
                acc[key].feedbacks.push(curr);
                return acc;
            }, {});

            return {
                ...feedback,
                subjectGroups: Object.values(subjectGroups),
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
              feedback.subjectGroups.map((group) => [
                  feedback.id || "-",
                  feedback.name || "-",
                  levelLookup[group.subject.level_id] || "-",
                  group.subject.subject_name || "-",
                  calculateCompletionStatus(group.feedbacks),
                  // Link to include year as URL parameter
                  <Link
                      to={`/assessment-feedback/history/student/${feedback.id}/subject/${group.subject.id}?year=${selectedYear}`}
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
            <ContentContainer title="Assessment Feedback List">
                <Row className="mb-3">
                    <Col xs="12" md="6" lg="8">
                        {/* Search Bar */}
                        <SearchBar
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            placeholder={
                                isMobile
                                    ? "Search name"
                                    : "Search student by name"
                            }
                        />
                    </Col>
                    <Col xs="12" md="6" lg="4">
                        {/* Year Filter */}
                        <select
                            value={selectedYear}
                            onChange={(e) =>
                                setSelectedYear(Number(e.target.value))
                            }
                            className="form-select"
                        >
                            {Array.from(
                                { length: 5 },
                                (_, i) => new Date().getFullYear() - i
                            ).map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </Col>
                </Row>

                {error && <div className="alert alert-danger">{error}</div>}

                {filteredFeedbacks.length === 0 && !feedbackData.loading ? (
                    <div className="alert alert-warning text-center">
                        No data for {selectedYear}.
                    </div>
                ) : (
                    <Table
                        header={tableHeader}
                        data={tableData}
                        itemsPerPage={10}
                    />
                )}
            </ContentContainer>
        </>
    );
}
