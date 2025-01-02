import React, { useState, useEffect } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axiosClient";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import { Table } from "../components/Table/Table";
import Button from "../components/Button/Button";
import "../css/Attendance.css";

export default function Attendance() {
    // Modal for user feedback
    const [modal, setModal] = useState({
        visible: false,
        message: "",
        type: "",
    });

    // Get current teacher
    const { token, user } = useStateContext();
    const [lessons, setLessons] = useState([]);
    const [teacherId, setTeacherId] = useState(null);

    const userName = user.name;

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
                    fetchEnrolledStudents(firstLessonId); // Fetch students for the first lesson
                    checkAttendance(firstLessonId); // Check attendance for the first lesson
                }
            } catch (error) {
                console.error("Error fetching lessons:", error);
            }
        }

        if (user.id) {
            fetchTeacher(); // Fetch the teacher when user.id is available
        }
    }, [user.id]);

    const [selectedLesson, setSelectedLesson] = useState(null);
    const [displayStudents, setStudents] = useState({
        loading: true,
        students: [],
    });

    // Fetch students enrolled in the selected lesson
    const fetchEnrolledStudents = async (lessonId) => {
        try {
            const res = await axiosClient.get(`/lessons/${lessonId}/students`);
            setStudents({
                loading: false,
                students: res.data.students,
            });
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    const [attendanceMarked, setAttendanceMarked] = useState(false);

    // Function to check attendance status
    async function checkAttendance(lessonId) {
        const today = new Date().toISOString().split("T")[0]; // Format the date as YYYY-MM-DD
        try {
            const response = await axiosClient.get(
                `/attendances/${lessonId}?date=${today}`
            );
            const { attendanceMarked } = response.data;
            setAttendanceMarked(attendanceMarked); // You should have a state to hold this value
        } catch (error) {
            console.error("Error checking attendance:", error);
        }
    }

    // Handle lesson selection
    const handleLessonChange = (e) => {
        const lessonId = e.target.value;
        setSelectedLesson(lessonId);
        fetchEnrolledStudents(lessonId); // Fetch students based on selected lesson
        checkAttendance(lessonId);
    };

    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");

    // Handle radio button selection
    // Either updates the attendance status for an existing student (for the same date only)
    // Or adds a new entry if the student is not already present
    function handleAttendanceChange(studentId, status) {
        setAttendanceData((prevData) => {
            const newData = [...prevData];
            const studentIndex = newData.findIndex(
                (item) => item.student_id === studentId
            );

            if (studentIndex !== -1) {
                // Update status if student is already in attendanceData
                newData[studentIndex].attendance_status = status;
            } else {
                // Add new entry for student
                newData.push({
                    student_id: studentId,
                    attendance_status: status,
                });
            }

            return newData;
        });
    }

    // Handle date selection
    function handleDateChange(e) {
        setSelectedDate(e.target.value);
    }

    // Save attendance to the backend
    async function saveAttendance() {
        // Transform the existing attendance data into a new array
        const attendanceRecords = attendanceData.map((item) => ({
            lesson_id: selectedLesson,
            student_id: item.student_id,
            attendance_status: item.attendance_status,
            date: selectedDate,
        }));

        try {
            const res = await axiosClient.post("/mark-attendance", {
                records: attendanceRecords,
            });

            if (res.status === 200) {
                setModal({
                    visible: true,
                    message: "Attendance saved successfully!",
                    type: "success",
                });
            }

            // Clear the attendance data to reset the form
            setAttendanceData([]);
        } catch (error) {
            console.error("Error saving attendance:", error.response);
            setModal({
                visible: true,
                message: "There's a problem saving attendance.",
                type: "error",
            });
        }

        setTimeout(() => {
            setModal({ visible: false, message: "", type: "" });
        }, 3000);
    }

    const tableHeader = ["ID", "Name", "Attendance Status"];
    const tableData = displayStudents.loading
        ? [
              [
                  <td colSpan="8">
                      <div className="d-flex justify-content-center align-items-center loader-container">
                          <div>Loading</div>
                      </div>
                  </td>,
              ],
          ]
        : displayStudents.students.length > 0
        ? displayStudents.students.map((student) => [
              student.id || "-",
              student.name || "-",
              <div>
                  <div className="form-check form-check-inline">
                      <input
                          className="form-check-input"
                          type="radio"
                          name={`attendance-${student.id}`}
                          onChange={() =>
                              handleAttendanceChange(student.id, "present")
                          }
                          checked={
                              attendanceData.find(
                                  (item) => item.student_id === student.id
                              )?.attendance_status === "present"
                          }
                          required
                      />
                      <label className="form-check-label">Present</label>
                  </div>
                  <div className="form-check form-check-inline">
                      <input
                          className="form-check-input"
                          type="radio"
                          name={`attendance-${student.id}`}
                          onChange={() =>
                              handleAttendanceChange(student.id, "absent")
                          }
                          checked={
                              attendanceData.find(
                                  (item) => item.student_id === student.id
                              )?.attendance_status === "absent"
                          }
                          required
                      />
                      <label className="form-check-label">Absent</label>
                  </div>
              </div>,
          ])
        : [
              [
                  <td colSpan="8">
                      <div className="d-flex justify-content-center align-items-center">
                          No students enrolled in this lesson
                      </div>
                  </td>,
              ],
          ];

    return (
        <>
            <div className="page-title">Attendance</div>
            <ContentContainer id="mark-attendance" title="Mark Attendance">
                <div>Hi, {userName}</div>
                {attendanceMarked ? (
                    <div className="indicator mb-2">
                        You have marked the attendance for today!
                    </div>
                ) : (
                    <div className="indicator mb-2">
                        You have not marked the attendance for today!
                    </div>
                )}
                <div className="search-container d-flex flex-sm-row flex-column gap-3 mb-5">
                    <select
                        className="form-control"
                        value={selectedLesson}
                        onChange={handleLessonChange}
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

                    <input
                        type="date"
                        className="form-control"
                        placeholder="Select Date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        required
                    />
                </div>
                <Table
                    header={tableHeader}
                    data={tableData}
                    itemsPerPage={10}
                ></Table>
                <div className="d-flex justify-content-sm-end justify-content-center mt-5">
                    <Button
                        type="submit "
                        onClick={saveAttendance}
                        color="yellow"
                    >
                        Save Attendance
                    </Button>
                </div>
            </ContentContainer>

            {modal.visible && (
                <div className={`modal-feedback ${modal.type}`}>
                    <p>{modal.message}</p>
                </div>
            )}
        </>
    );
}
