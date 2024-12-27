import React, { useEffect, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import OverviewItem from "../components/ContentContainer/OverviewItem";
import axiosClient from "../axiosClient";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import AttendancePieChart from "../components/Chart/AttendancePieChart";
import PieChart from "../components/Chart/PieChart";
import "../css/TeacherDashboard.css";

export default function TeacherDashboard() {
    // Get the logged-in user from context
    const { user } = useStateContext();

    // Overview Item Data
    // Get student record
    const [studentCount, setStudentCount] = useState(0);
    const [maleCount, setMaleCount] = useState(0);
    const [femaleCount, setFemaleCount] = useState(0);

    // Get attendance rate
    const [attendanceRate, setAttendanceRate] = useState(0);
    const [absentRate, setAbsentRate] = useState(0);

    // Get subject and feedback counts
    const [subjectTeachCount, setSubjectTeachCount] = useState(0);
    const [feedbackCount, setFeedbackCount] = useState(0);

    useEffect(() => {
        const fetchDashboardCounts = async () => {
            try {
                const res = await axiosClient.get(
                    `/teacher-dashboard-counts/${user.id}`
                );
                setStudentCount(res.data.total || 0);
                setMaleCount(res.data.male || 0);
                setFemaleCount(res.data.female || 0);
                setSubjectTeachCount(res.data.subjectTeachCount || 0);

                // Attendance rates
                setAttendanceRate(res.data.attendanceRate || 0);
                setAbsentRate(res.data.absentRate || 0);

                // Feedback counts
                const completedFeedbackCount = res.data.completedFeedbackCount;
                const overallFeedbackCount = res.data.overallFeedbackCount;

                // Calculate the ratio (completed/overall)
                const feedbackRatio =
                    overallFeedbackCount > 0
                        ? `${completedFeedbackCount}/${overallFeedbackCount}`
                        : "0/0"; // no feedback exists

                setFeedbackCount(feedbackRatio);
            } catch (error) {
                console.error(
                    "Error fetching teacher dashboard counts:",
                    error
                );
                alert(
                    "Failed to fetch dashboard data. Please try again later."
                );
            }
        };

        fetchDashboardCounts();
    }, [user.id]);

    return (
        <>
            <div className="page-title">Teacher Dashboard</div>
            <div className="mt-3">
                <p>Welcome, Teacher {user.name || "Teacher"}</p>
            </div>

            <div className="wrapper d-flex flex-column">
                <div className="first-row d-flex flex-wrap gap-3 mt-3">
                    <div className="col-12 col-md-6 col-lg-4 mb-3">
                        <OverviewItem
                            iconSrc="student-num.png"
                            title="Total Student Teach"
                            text={studentCount}
                            lineColor="#904dbc"
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4 mb-3">
                        <OverviewItem
                            iconSrc="subject-num.png"
                            title="Subjects Taught"
                            text={subjectTeachCount}
                            lineColor="#904dbc"
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4 mb-3">
                        <OverviewItem
                            iconSrc="teacher-num.png"
                            title="Total Feedback Completed"
                            text={feedbackCount}
                            lineColor="#904dbc"
                        />
                    </div>
                </div>
            </div>

            <div className="row mt-3 g-3">
                <div className="col-12 col-lg-6 mb-3">
                    <ContentContainer
                        title="Attendance Rate"
                        className="dashboard-pie-chart-container"
                    >
                        <div className="dashboard-pie-chart">
                            <AttendancePieChart
                                attendanceRate={attendanceRate}
                                absentRate={absentRate}
                            />
                        </div>
                    </ContentContainer>
                </div>

                <div className="col-12 col-lg-6 mb-3">
                    <ContentContainer
                        title="Students Gender"
                        className="dashboard-pie-chart-container"
                    >
                        <div className="dashboard-pie-chart">
                            <PieChart
                                maleCount={maleCount}
                                femaleCount={femaleCount}
                            />
                        </div>
                    </ContentContainer>
                </div>
            </div>
        </>
    );
}
