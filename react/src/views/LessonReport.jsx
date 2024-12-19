import React, { useState, useEffect } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axiosClient";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import { Table } from "../components/Table/Table";
import Button from "../components/Button/Button";
import dayjs from "dayjs";
import BarChart from "../components/Chart/BarChart";
import "../css/Attendance.css";

export default function LessonReport() {
    // Get current teacher
    const { token, user } = useStateContext();
    const [lessons, setLessons] = useState([]);

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
        // Step 1: Fetch the teacher record by user.id
        async function fetchTeacher() {
            try {
                const teacherRes = await axiosClient.get(
                    `/teachers/users/${user.id}`
                );
                const teacher = teacherRes.data;

                // Step 2: Fetch lessons after retrieving teacher.id
                fetchLessons(teacher.id);
            } catch (error) {
                console.error("Error fetching teacher:", error);
            }
        }

        async function fetchLessons(teacherId) {
            try {
                const res = await axiosClient.get("/lessons");

                // Step 3: Filter lessons by teacherId
                const filteredLessons = res.data.lessons.filter(
                    (lesson) => lesson.teacher_id === teacherId
                );
                setLessons(filteredLessons);

                if (filteredLessons.length > 0) {
                    const firstLessonId = filteredLessons[0].id;
                    setSelectedLesson(firstLessonId);
                }
            } catch (error) {
                console.error("Error fetching lessons:", error);
            }
        }

        if (user.id) {
            fetchTeacher(); // Fetch the teacher when user.id is available
        }
    }, [user.id]);

    // Filter
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [dateRangeOption, setDateRangeOption] = useState("thisMonth");

    // Catch total lessons held
    const [totalClasses, setTotalClasses] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);

    // Catch total students
    const [totalStudents, setTotalStudents] = useState(null);

    // Catch average attendance rate
    const [averageAttendanceRate, setAverageAttendanceRate] = useState(null);

    // Stores the currently viewed lesson details
    const [viewedLesson, setViewedLesson] = useState(null);
    // Stores the currently viewed date range
    const [viewedDateRange, setViewedDateRange] = useState("");
    // State for "no data found" message
    const [noDataFound, setNoDataFound] = useState(false);

    // For bar chart
    const [lessonDates, setLessonDates] = useState([]);
    const [attendanceRates, setAttendanceRates] = useState([]);

    const [studentNames, setStudentNames] = useState([]);
    const [absenceCounts, setAbsenceCounts] = useState([]);

    // Fetch student absences for the lesson in the specified date range
    const [attendanceData, setAttendanceData] = useState([]);

    const handleFilter = async () => {
        // Reset the values when the filter button is clicked
        setTotalClasses(0);
        setTotalStudents(0);
        setAverageAttendanceRate(0);
        setLessonDates([]);
        setAttendanceRates([]);
        setStudentNames([]);
        setAbsenceCounts([]);
        setAttendanceData([]);
        setNoDataFound(false); // Reset no data found state initially

        // Determine date range based on dateRangeOption
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

        // Fetch the lesson, students, attendance rate, and absences data
        if (selectedLesson) {
            try {
                // Fetch total classes held
                const classesResponse = await axiosClient.get(
                    `/lessons/${selectedLesson}/classes/count`,
                    {
                        params: { start_date: rangeStart, end_date: rangeEnd },
                    }
                );
                setTotalClasses(classesResponse.data.totalClasses);

                // Fetch total students
                const studentsResponse = await axiosClient.get(
                    `/lessons/${selectedLesson}/students/count`
                );
                setTotalStudents(studentsResponse.data.totalStudents);

                // Fetch average attendance rate
                const attendanceRateResponse = await axiosClient.get(
                    `/lessons/${selectedLesson}/attendance/average-rate`,
                    {
                        params: { start_date: rangeStart, end_date: rangeEnd },
                    }
                );

                const data = attendanceRateResponse.data;

                if (data && data.attendanceRatesByDate.length > 0) {
                    setAverageAttendanceRate(data.averageAttendanceRate);
                    setLessonDates(
                        data.attendanceRatesByDate.map((item) => item.date)
                    );
                    setAttendanceRates(
                        data.attendanceRatesByDate.map(
                            (item) => item.attendanceRate
                        )
                    );

                    const selectedLessonDetails = lessons.find(
                        (lesson) => lesson.id == selectedLesson
                    );
                    console.log(selectedLesson);
                    if (selectedLessonDetails) {
                        setViewedLesson(
                            `${selectedLessonDetails.level_name} - ${selectedLessonDetails.subject_name}`
                        );
                        setViewedDateRange(`${rangeStart} to ${rangeEnd}`);
                    } else {
                        setNoDataFound(true);
                        setViewedLesson(null);
                        setViewedDateRange("");
                    }
                } else {
                    setNoDataFound(true);
                }

                // Fetch absences data
                const absencesResponse = await axiosClient.get(
                    `/lessons/${selectedLesson}/absences`,
                    {
                        params: {
                            start_date: rangeStart,
                            end_date: rangeEnd,
                        },
                    }
                );

                const absencesData = absencesResponse.data.absenceData;
                if (absencesData && absencesData.length > 0) {
                    setStudentNames(
                        absencesData.map((item) => item.student_name)
                    );
                    setAbsenceCounts(
                        absencesData.map((item) => item.absence_count)
                    );
                } else {
                    // there might be instance where there are no number of absence
                    // setNoDataFound(true);
                    setStudentNames([]);
                    setAbsenceCounts([]);
                }

                // Fetch students data
                const studentResponse = await axiosClient.get(
                    `/lessons/${selectedLesson}/students/attendance-details`,
                    { params: { start_date: rangeStart, end_date: rangeEnd } }
                );

                if (studentResponse.data && studentResponse.data.length > 0) {
                    const formattedData = studentResponse.data.map((item) => [
                        item.id,
                        item.name,
                        item.totalPresentDays,
                        item.totalAbsentDays,
                        `${item.averageAttendanceRate}%`,
                    ]);

                    setAttendanceData(formattedData);
                } else {
                    setNoDataFound(true);
                    setAttendanceData([]);
                }
            } catch (error) {
                console.error(
                    "Error fetching attendance or absence or student data",
                    error
                );
                setNoDataFound(true); // Set no data found message on error
                setViewedLesson(null);
                setViewedDateRange("");
            }
        } else {
            setNoDataFound(true); // Set no data found when no lesson is selected
        }
    };

    return (
        <>
            <div className="page-title">Lesson Report</div>
            <ContentContainer title="View Detailed Report">
                <div className="d-flex gap-3">
                    <select
                        className="form-control"
                        value={selectedLesson}
                        onChange={(e) => setSelectedLesson(e.target.value)} // Set selected lesson id
                    >
                        {lessons.map((lesson) => (
                            <option key={lesson.id} value={lesson.id}>
                                {lesson.level_name} - {lesson.subject_name},{" "}
                                {daysOfWeek[lesson.day]}{" "}
                                {lesson.start_time
                                    ? formatTimeTo12Hour(lesson.start_time)
                                    : "TBD"}{" "}
                                -{" "}
                                {lesson.end_time
                                    ? formatTimeTo12Hour(lesson.end_time)
                                    : "TBD"}
                            </option>
                        ))}
                    </select>
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
            </ContentContainer>
            <ContentContainer className="attendance-report-data">
                {/* Display feedback message */}
                {noDataFound ? (
                    <div className="alert alert-warning">
                        No data found for the selected lesson and date range.
                    </div>
                ) : (
                    viewedLesson &&
                    viewedDateRange && (
                        <div className="alert alert-info">
                            Displaying data for <strong>{viewedLesson}</strong>{" "}
                            from <strong>{viewedDateRange}</strong>
                        </div>
                    )
                )}
                <div className="d-flex justify-content-between gap-2">
                    <div className="box-data p-4">
                        <div>Total Classes Held</div>
                        <p>{totalClasses !== null ? totalClasses : "-"}</p>
                    </div>
                    <div className="box-data p-4">
                        <div>Total Students</div>
                        <p>{totalStudents !== null ? totalStudents : "-"}</p>
                    </div>
                    <div className="box-data p-4">
                        <div>Average Attendance Rate</div>
                        <p>
                            {averageAttendanceRate !== null
                                ? `${averageAttendanceRate.toFixed(2)}%`
                                : "-"}
                        </p>
                    </div>
                </div>
                <div className="d-flex w-100 mt-5 gap-2">
                    <BarChart
                        chartTitle="Daily Attendance Rate (%)"
                        xAxis="Lesson Dates"
                        yAxis="Attendance Rate (%)"
                        xData={lessonDates}
                        yData={attendanceRates}
                        stepSize="10"
                        maxBars="4"
                    />
                    <BarChart
                        chartTitle="Number of Absence"
                        xAxis="Student"
                        yAxis="Number of Absence"
                        xData={studentNames}
                        yData={absenceCounts}
                        stepSize="1"
                        maxBars="4"
                    />
                </div>
                <div className="mt-5">
                    <Table
                        header={[
                            "ID",
                            "Name",
                            "Total Present Day",
                            "Total Absent Day",
                            "Average Percentage",
                        ]}
                        data={attendanceData}
                        itemsPerPage={5}
                    ></Table>
                </div>
            </ContentContainer>
        </>
    );
}
