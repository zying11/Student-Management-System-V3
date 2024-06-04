import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Attendance() {
    const [date, setDate] = useState("");
    const [lesson, setLesson] = useState("");
    const [lessons, setLessons] = useState([]);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});

    // Fetch student list
    useEffect(() => {
        async function fetchStudents() {
            try {
                const res = await axios.get(
                    "http://127.0.0.1:8000/api/students"
                );
                setStudents(res.data.data);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        }

        fetchStudents();
    }, []);

    // Fetch lesson list and display in dropdown menu
    useEffect(() => {
        async function fetchLessons() {
            try {
                const res = await axios.get(
                    "http://127.0.0.1:8000/api/lessons"
                );
                setLessons(res.data.lessons);
            } catch (error) {
                console.error("Error fetching lessons:", error);
            }
        }

        fetchLessons();
    }, []);

    const dayMapping = {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday",
    };

    const studyLevelMapping = {
        0: "Pre & Lower Primary",
        1: "Upper Primary",
    };

    const handleAttendanceChange = (studentId, status) => {
        setAttendance((prev) => ({ ...prev, [studentId]: status }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const attendanceData = Object.keys(attendance).map((studentId) => ({
            student_id: studentId,
            lesson_id: lesson,
            attendance_status: attendance[studentId],
            attendance_date: date,
        }));

        console.log(attendanceData);

        try {
            // Send each attendance record separately
            for (const record of attendanceData) {
                await axios.post(
                    "http://127.0.0.1:8000/api/mark-attendance",
                    record
                );
            }
            alert("Attendance marked successfully!");
        } catch (error) {
            console.error(
                "Error saving attendance:",
                error.response?.data || error.message
            );
            alert("Failed to save attendance.");
        }
    };

    return (
        <div className="p-4">
            <h2>Student Attendance</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="attendance-date" className="form-label">
                        Date
                    </label>
                    <input
                        type="date"
                        id="attendance-date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="lesson" className="form-label">
                        Lesson
                    </label>
                    <select
                        id="lesson"
                        value={lesson}
                        onChange={(e) => setLesson(e.target.value)}
                        className="form-control"
                        required
                    >
                        <option value="">Select a lesson</option>
                        {lessons.map((lesson) => (
                            <option key={lesson.id} value={lesson.id}>
                                {lesson.subject_name},{" "}
                                {studyLevelMapping[lesson.level_id]},{" "}
                                {dayMapping[lesson.day]}, {lesson.start_time} to{" "}
                                {lesson.end_time}
                            </option>
                        ))}
                    </select>
                </div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Student ID</th>
                            <th scope="col">Student Name</th>
                            <th scope="col">Attendance Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id}>
                                <td>{student.id}</td>
                                <td>{student.name}</td>
                                <td>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name={`attendance-${student.id}`}
                                            id={`present-${student.id}`}
                                            value="present"
                                            onChange={() =>
                                                handleAttendanceChange(
                                                    student.id,
                                                    "present"
                                                )
                                            }
                                            required
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor={`present-${student.id}`}
                                        >
                                            Present
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name={`attendance-${student.id}`}
                                            id={`absent-${student.id}`}
                                            value="absent"
                                            onChange={() =>
                                                handleAttendanceChange(
                                                    student.id,
                                                    "absent"
                                                )
                                            }
                                            required
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor={`absent-${student.id}`}
                                        >
                                            Absent
                                        </label>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button type="submit" className="btn btn-primary">
                    Save Attendance
                </button>
            </form>
        </div>
    );
}
