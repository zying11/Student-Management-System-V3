import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../components/Button/Button";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import { Table } from "../components/Table/Table";
import "../css/Lesson.css";

export default function Lesson() {
    // Variable for posting lessons data
    const [lessonData, setLessonData] = useState({
        subjectId: "",
        teacher: "",
        duration: "",
    });

    // Post lessons data
    const saveLesson = async (e) => {
        e.preventDefault();

        // Simple validation for required fields
        if (
            !lessonData.subjectId ||
            !lessonData.teacher ||
            !lessonData.duration
        ) {
            setError("Please fill in all fields");
            return;
        }

        try {
            const res = await axios.post(
                "http://127.0.0.1:8000/api/add-lesson",
                lessonData
            );
            console.log(res.data);
        } catch (error) {
            console.error("Error:", error.response.data); //use err.response.data to display more info about the err
        }

        // Clear the form and error message
        setLessonData({
            subjectId: "",
            capacity: "",
            duration: "",
        });
        setError("");
    };

    // Variable for fetching lesson data
    const [displayLesson, setDisplayLesson] = useState({
        lessons: [],
        loading: true,
    });

    // Fetch lessons data
    useEffect(() => {
        async function fetchLessons() {
            try {
                const res = await axios.get(
                    "http://127.0.0.1:8000/api/lessons"
                );
                console.log(res.data.lessons);

                setDisplayLesson({
                    lessons: res.data.lessons,
                    loading: false,
                });
            } catch (error) {
                console.error("Error fetching lessons:", error);
            }
        }

        fetchLessons();
    }, []);

    // Delete lesson data
    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(
                `http://127.0.0.1:8000/api/lessons/${id}`
            );
            console.log(res.data);
            setDisplayLesson((prevData) => {
                if (Array.isArray(prevData.lessons)) {
                    return {
                        ...prevData,
                        // Creates a new array by including only those lessons for which the condition (lesson.id !== id) is true.
                        lessons: prevData.lessons.filter(
                            (lesson) => lesson.id !== id
                        ),
                    };
                }
                return prevData; // Return the previous state if it's not an array
            });
        } catch (error) {
            console.error("Error deleting lesson:", error);
        }
    };

    // Variable for fetching subject data
    const [subjects, setSubject] = useState([]);

    // Fetch subject data
    useEffect(() => {
        async function fetchSubjects() {
            try {
                const res = await axios.get(
                    "http://127.0.0.1:8000/api/subjects"
                );

                console.log(res.data.subjects);

                setSubject(res.data.subjects);
            } catch (error) {
                console.error("Error fetching lessons:", error);
            }
        }

        fetchSubjects();
    }, []);

    // Error handling
    const [error, setError] = useState("");

    // Handling input changes
    const handleInput = (e) => {
        // Destructure name and value from the event target (the input element that triggered the change)
        const { name, value } = e.target;

        // Update the lessonData state
        setLessonData((prevLessonData) => ({
            // Spread the previous state to retain all existing values
            ...prevLessonData,

            // Update the property that matches the input's name attribute
            [name]: value,
        }));
    };

    const tableHeader = [
        "ID",
        "Subject",
        "Study Level",
        "Teacher",
        "Day",
        "Start Time",
        "End Time",
        "Actions",
    ];

    const tableData = displayLesson.loading
        ? [
              [
                  <td colSpan="8">
                      <h4>Loading...</h4>
                  </td>,
              ],
          ]
        : displayLesson.lessons.map((lesson) => [
              lesson.id,
              lesson.subject?.subject_name || "-",
              lesson.level_name || "-",
              lesson.teacher_id || "-",
              lesson.day || "-",
              lesson.start_time || "-",
              lesson.end_time || "-",
              <div className="actions">
                  <img
                      className="me-2"
                      src="http://localhost:8000/icon/edit.png"
                      alt="Edit"
                  />
                  <img
                      className="me-2"
                      src="http://localhost:8000/icon/delete.png"
                      alt="Delete"
                      onClick={() => handleDelete(lesson.id)}
                      style={{ cursor: "pointer" }}
                  />
                  <img src="http://localhost:8000/icon/more.png" alt="More" />
              </div>,
          ]);

    return (
        <>
            <div className="page-title">Lesson</div>
            <div className="d-flex justify-content-end">
                <Button
                    data-bs-toggle="modal"
                    data-bs-target="#createLessonModal"
                >
                    Add Lesson
                </Button>
            </div>
            <ContentContainer title="Current Active Lessons">
                <Table header={tableHeader} data={tableData}></Table>
            </ContentContainer>
            <div
                id="createLessonModal"
                className="modal fade"
                tabindex="-1"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
            >
                <div className="modal-dialog">
                    <div className="modal-content p-4">
                        <h3>Create a new class</h3>
                        {error && (
                            <div className="alert alert-danger">{error}</div>
                        )}
                        <form method="post" onSubmit={saveLesson}>
                            {/* Subject input */}
                            <div className="mb-3">
                                <label className="form-label">Subject</label>
                                <select
                                    name="subjectId"
                                    onChange={handleInput}
                                    value={lessonData.subjectId}
                                    className="form-control"
                                    required
                                >
                                    <option value="">Select a subject</option>
                                    {subjects.map((subject) => (
                                        <option
                                            key={subject.id}
                                            value={subject.id}
                                        >
                                            {subject.level_name} -{" "}
                                            {subject.subject_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Teacher</label>
                                <select
                                    name="teacher"
                                    onChange={handleInput}
                                    value={lessonData.teacher}
                                    className="form-control"
                                    required
                                >
                                    <option value="">Select a teacher</option>
                                    <option>Teacher Khajidah</option>
                                    <option>Teacher Siti</option>
                                </select>
                            </div>

                            {/* Capacity
                            <div className="mb-3">
                                <label className="form-label">
                                    Max Capacity
                                </label>
                                <input
                                    type="number"
                                    name="capacity"
                                    onChange={handleInput}
                                    value={lessonData.capacity}
                                    className="form-control"
                                    required
                                />
                            </div> */}

                            {/* Duration */}
                            <div className="mb-3">
                                <label className="form-label">Duration</label>
                                <input
                                    type="number"
                                    name="duration"
                                    onChange={handleInput}
                                    value={lessonData.duration}
                                    className="form-control"
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary">
                                Create
                            </button>
                            <button
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
