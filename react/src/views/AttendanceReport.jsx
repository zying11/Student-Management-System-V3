import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axiosClient";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import { Table } from "../components/Table/Table";
import Button from "../components/Button/Button";

export default function AttendanceReport() {
    // Get current teacher
    const { token, user } = useStateContext();
    const [displayLessons, setLessons] = useState({
        loading: true,
        lessons: [],
    });
    const [teacherId, setTeacherId] = useState(null);

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

                // Set the teacher.id to state
                setTeacherId(teacher.id);

                // if (teacher.id) {
                //     console.log(teacherId);
                // }

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
                setLessons({
                    loading: false,
                    lessons: filteredLessons,
                });

                // console.log(filteredLessons);
            } catch (error) {
                console.error("Error fetching lessons:", error);
            }
        }

        if (user.id) {
            fetchTeacher(); // Fetch the teacher when user.id is available
        }
    }, [user.id]);

    const [displayStudents, setStudents] = useState({
        loading: true,
        students: [],
    });

    useEffect(() => {
        // Fetch students enrolled in the teacher's lessons
        async function fetchStudents() {
            try {
                const res = await axiosClient.get(
                    `/teachers/${teacherId}/students`
                );

                setStudents({
                    loading: false,
                    students: res.data.students,
                });
                // console.log(res.data.students);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        }

        if (teacherId) {
            fetchStudents();
        }
    }, [teacherId]);

    const [studentAttendanceData, setStudentAttendanceData] = useState([]);

    const fetchAttendancePercentages = async (studentIds) => {
        // For each student ID, it creates an array of promises (attendancePromises) by mapping over the studentIds
        // Each promise is a call to the backend API to fetch the attendance percentage for that specific student
        const attendancePromises = studentIds.map((id) =>
            axiosClient.get(`/attendances/percentage/${id}`)
        );

        try {
            // Waits for all promises to resolve using Promise.all(), which allows multiple asynchronous operations to run in parallel
            const results = await Promise.all(attendancePromises);
            const attendanceData = results.map(
                (res) => res.data.attendance_percentage
            );
            setStudentAttendanceData(attendanceData);
        } catch (error) {
            console.error(
                "Error fetching attendance percentages:",
                error.response
            );
        }
    };

    // Fetch attendance percentages when students are loaded
    useEffect(() => {
        if (displayStudents.students.length > 0) {
            const studentIds = displayStudents.students.map(
                (student) => student.id
            );
            fetchAttendancePercentages(studentIds);
        }
    }, [displayStudents.students]);

    const lessonData = displayLessons.loading
        ? [
              [
                  <td colSpan="8">
                      <div className="d-flex justify-content-center align-items-center loader-container">
                          <div>Loading</div>
                      </div>
                  </td>,
              ],
          ]
        : displayLessons.lessons.map((lesson) => [
              lesson.id || "-",
              lesson.subject_name || "-",
              lesson.level_name || "-",
              daysOfWeek[lesson.day] || "-",
              lesson.start_time && lesson.end_time
                  ? `${formatTimeTo12Hour(
                        lesson.start_time
                    )} - ${formatTimeTo12Hour(lesson.end_time)}`
                  : "-",
          ]);
    const studentData = displayStudents.loading
        ? [
              [
                  <td colSpan="8">
                      <div className="d-flex justify-content-center align-items-center loader-container">
                          <div>Loading</div>
                      </div>
                  </td>,
              ],
          ]
        : displayStudents.students.map((student, index) => [
              student.id || "-",
              student.name || "-",
              typeof studentAttendanceData[index] !== "undefined"
                  ? `${studentAttendanceData[index].toFixed(2)}%`
                  : "N/A",
              <div>
                  {/* <Link to={`/student/attendance/${student.id}`}> */}
                  <button
                      type="button"
                      className="btn-create btn-create-yellow"
                  >
                      View Details
                  </button>
                  {/* </Link> */}
              </div>,
          ]);

    return (
        <>
            <div className="page-title">Attendance Report</div>
            <div className="d-flex justify-content-end">
                {/* <Button type="button">
                    <Link to="/lesson-report" />
                    Generate Report
                </Button> */}
                <button type="button" className="btn-create btn-create-purple">
                    <Link
                        to="/lesson-report"
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        Generate Report
                    </Link>
                </button>
            </div>
            <ContentContainer title="My Classes">
                <Table
                    header={["ID", "Subject", "Study Year", "Day", "Time"]}
                    data={lessonData}
                    itemsPerPage={5}
                ></Table>
            </ContentContainer>
            <ContentContainer title="Overall Student Attendance Status">
                <Table
                    header={["ID", "Name", "Attendance Percentage", "Report"]}
                    data={studentData}
                    itemsPerPage={5}
                ></Table>
            </ContentContainer>
        </>
    );
}
