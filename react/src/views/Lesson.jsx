import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Lesson.css";

export default function Lesson() {
    // Variable for posting lessons data
    const [lessonData, setLessonData] = useState({
        subjectId: "",
        capacity: "",
        duration: "",
    });
    // Variable for fetching lesson data
    const [displayData, setDisplayData] = useState({
        lessons: [],
        loading: true,
    });

    // Variable for fetching subject data
    const [subjects, setSubject] = useState([]);

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

    // Post lessons data
    const saveLesson = async (e) => {
        e.preventDefault();

        // Simple validation for required fields
        if (
            !lessonData.subjectId ||
            !lessonData.capacity ||
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

    // Fetch lessons data
    useEffect(() => {
        async function fetchLessons() {
            try {
                const res = await axios.get(
                    "http://127.0.0.1:8000/api/lessons"
                );
                console.log(res.data.lessons);

                setDisplayData({
                    lessons: res.data.lessons,
                    loading: false,
                });
            } catch (error) {
                console.error("Error fetching lessons:", error);
            }
        }

        fetchLessons();
    }, []);

    const lesson_HTMLTABLE = displayData.loading ? (
        <tr>
            <td colSpan="8">
                <h4>Loading...</h4>
            </td>
        </tr>
    ) : (
        displayData.lessons.map((item) => (
            <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.subject.study_level}</td> {/* Display study level */}
                <td>{item.subject.subject_name}</td>{" "}
                {/* Display subject name */}
                <td>{item.capacity}</td>
                <td>{item.duration}</td>
                <td>{item.day}</td>
                <td>{item.start_time}</td>
                <td>{item.end_time}</td>
            </tr>
        ))
    );

    return (
        <>
            <div className="position-relative d-flex flex-column align-items-end p-5">
                <button
                    className="btn btn-primary btn-create"
                    data-bs-toggle="modal"
                    data-bs-target="#createLessonModal"
                >
                    Create Lesson
                </button>
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Study Level</th>
                            <th>Subject Name</th>
                            <th>Capacity</th>
                            <th>Duration</th>
                            <th>Day</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                        </tr>
                    </thead>
                    <tbody>{lesson_HTMLTABLE}</tbody>
                </table>
            </div>
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
                                <label className="form-label">
                                    Subject Name
                                </label>
                                <select
                                    name="subjectId" // Use 'name' attribute to match state key
                                    onChange={handleInput}
                                    value={lessonData.subjectId} // Bind value to state
                                    className="form-control"
                                    required
                                >
                                    <option value="">Select a subject</option>
                                    {subjects.map((subject) => (
                                        <option
                                            key={subject.id}
                                            value={subject.id}
                                        >
                                            {subject.study_level},{" "}
                                            {subject.subject_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Capacity */}
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
                            </div>

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
