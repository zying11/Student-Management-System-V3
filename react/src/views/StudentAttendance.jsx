import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axiosClient";
import dayjs from "dayjs";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import { Table } from "../components/Table/Table";
import BarChart from "../components/Chart/BarChart";
import Button from "../components/Button/Button";

export default function StudentAttendance() {
    const { id } = useParams();
    const [displayEnrollments, setEnrollments] = useState({
        loading: true,
        enrollments: [],
    });

    const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    // Helper function to convert 24-hour time to 12-hour format
    function formatTimeTo12Hour(time) {
        let [hour, minute] = time.split(":"); // Split the time into hour and minute
        hour = parseInt(hour, 10); // Convert hour string to an integer

        const ampm = hour >= 12 ? "PM" : "AM"; // Determine AM or PM
        hour = hour % 12 || 12; // Convert to 12-hour format, 0 becomes 12

        return `${hour}${ampm}`; // Return formatted time
    }

    useEffect(() => {
        async function fetchEnrollments() {
            try {
                const res = await axiosClient.get(`/enrollments/${id}`);
                const data = res.data;

                setEnrollments({
                    loading: false,
                    enrollments: data,
                });
            } catch (error) {
                console.error(
                    "Error fetching students enrollments:",
                    error.response
                );
            }
        }

        fetchEnrollments();
    }, [id]);

    const studentName =
        displayEnrollments.enrollments?.[0]?.student?.name || "Loading...";

    //Filter states
    const [dateRangeOption, setDateRangeOption] = useState("thisMonth");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Stores the currently viewed date range
    const [viewedDateRange, setViewedDateRange] = useState("");
    // State for "no data found" message
    const [noDataFound, setNoDataFound] = useState(false);

    // Attendance data
    const [attendanceData, setAttendanceData] = useState({
        totalPresent: 0,
        totalAbsent: 0,
        attendanceRate: 0,
        attendanceRecords: [],
        dateRange: { start: "", end: "" },
    });

    // For bar chart
    const [subjectNames, setSubjectNames] = useState([]);
    const [attendanceRates, setAttendanceRates] = useState([]);
    const [absenceCounts, setAbsenceCounts] = useState([]);

    const handleFilter = async () => {
        let rangeStart = startDate;
        let rangeEnd = endDate;

        if (dateRangeOption === "thisMonth") {
            rangeStart = dayjs().startOf("month").format("YYYY-MM-DD");
            rangeEnd = dayjs().endOf("month").format("YYYY-MM-DD");
        } else if (dateRangeOption === "lastMonth") {
            rangeStart = dayjs()
                .subtract(1, "month")
                .startOf("month")
                .format("YYYY-MM-DD");
            rangeEnd = dayjs()
                .subtract(1, "month")
                .endOf("month")
                .format("YYYY-MM-DD");
        }

        try {
            const response = await axiosClient.get(`/attendance/${id}`, {
                params: {
                    startDate: rangeStart,
                    endDate: rangeEnd,
                },
            });
            console.log(response);

            if (
                response.data &&
                response.data.attendanceRecords &&
                response.data.attendanceRecords.length > 0
            ) {
                setAttendanceData(response.data);

                setNoDataFound(false);
                setViewedDateRange(`${rangeStart} to ${rangeEnd}`);
            } else {
                setNoDataFound(true);
                setAttendanceData({
                    totalPresent: 0,
                    totalAbsent: 0,
                    attendanceRate: 0,
                    attendanceRecords: [],
                    dateRange: { start: rangeStart, end: rangeEnd },
                });
            }

            const res = await axiosClient.get(`/attendance/summary/${id}`, {
                params: {
                    startDate: rangeStart,
                    endDate: rangeEnd,
                },
            });

            const attendanceSummary = res.data;

            // Process data for BarChart
            const subjects = attendanceSummary.map((item) => item.subject_name);
            const rates = attendanceSummary.map((item) => item.attendanceRate);
            const absence = attendanceSummary.map((item) => item.totalAbsent);

            setSubjectNames(subjects);
            setAttendanceRates(rates);
            setAbsenceCounts(absence);
        } catch (error) {
            console.error("Error fetching attendance data:", error.response);
        }
    };

    const lessonData = displayEnrollments.loading
        ? [
              [
                  <td colSpan="8">
                      <div className="d-flex justify-content-center align-items-center loader-container">
                          <div>Loading</div>
                      </div>
                  </td>,
              ],
          ]
        : displayEnrollments.enrollments.map((enrollment) => [
              enrollment.lesson_id || "-",
              enrollment.subject.subject_name || "-",
              enrollment.subject.study_level.level_name || "-",
              daysOfWeek[enrollment.lesson.day] || "-",
              enrollment.lesson.start_time && enrollment.lesson.end_time
                  ? `${formatTimeTo12Hour(
                        enrollment.lesson.start_time
                    )} - ${formatTimeTo12Hour(enrollment.lesson.end_time)}`
                  : "-",
              enrollment.lesson.teacher.user.name || "-",
          ]);

    // Media query for Bar Chart
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 450);

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth > 450);
        };

        window.addEventListener("resize", handleResize);

        // Clean up event listener
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            <ContentContainer title={studentName}>
                <div className="d-flex gap-2 mb-3">
                    <select
                        className="form-control"
                        value={dateRangeOption}
                        onChange={(e) => setDateRangeOption(e.target.value)}
                    >
                        <option value="thisMonth">This Month</option>
                        <option value="lastMonth">Last Month</option>
                        <option value="custom">Custom Range</option>
                    </select>
                    {dateRangeOption === "custom" && (
                        <div className="d-flex gap-2">
                            <input
                                type="date"
                                className="form-control"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                placeholder="Start Date"
                            />
                            <input
                                type="date"
                                className="form-control"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                placeholder="End Date"
                            />
                        </div>
                    )}
                    <Button color="yellow" onClick={handleFilter}>
                        Filter
                    </Button>
                </div>

                <Table
                    header={[
                        "ID",
                        "Subject",
                        "Study Level",
                        "Day",
                        "Time",
                        "Teacher",
                    ]}
                    data={lessonData}
                    itemsPerPage={5}
                ></Table>
            </ContentContainer>
            <ContentContainer className="attendance-report-data">
                {/* Display feedback message */}
                {noDataFound ? (
                    <div className="alert alert-warning">
                        No data found for the selected date range.
                    </div>
                ) : (
                    viewedDateRange && (
                        <div className="alert alert-info">
                            Displaying data from{" "}
                            <strong>{viewedDateRange}</strong>
                        </div>
                    )
                )}
                <div className="d-flex justify-content-xl-between gap-2 flex-wrap">
                    <div className="box-data p-sm-4 p-3">
                        <div>Total Present Days</div>
                        <p>{attendanceData.totalPresent}</p>
                    </div>
                    <div className="box-data p-sm-4 p-3">
                        <div>Total Absent Days</div>
                        <p>{attendanceData.totalAbsent}</p>
                    </div>
                    <div className="box-data p-sm-4 p-3">
                        <div>Average Attendance Rate</div>
                        <p>{attendanceData.attendanceRate}%</p>
                    </div>
                </div>

                {isLargeScreen ? (
                    <div className="d-flex w-100 mt-5 gap-2">
                        <BarChart
                            chartTitle="Attendance Rate per Subject"
                            xAxis="Subjects"
                            yAxis="Attendance Rate (%)"
                            xData={subjectNames}
                            yData={attendanceRates}
                            stepSize="10"
                        />
                        <BarChart
                            chartTitle="Absence Count per Subject"
                            xAxis="Subjects"
                            yAxis="Absence Count"
                            xData={subjectNames}
                            yData={absenceCounts}
                            stepSize="1"
                        />
                    </div>
                ) : (
                    <p className="mt-5">
                        Screen size is too small. Please switch to a bigger
                        screen size to view the chart.
                    </p>
                )}
            </ContentContainer>
        </>
    );
}
