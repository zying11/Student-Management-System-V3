import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Lesson.css";

export default function Lesson() {
    // For post data
    const [lessonData, setLessonData] = useState({
        subjectName: "",
        studyLevel: "",
        capacity: "",
        duration: "",
    });
    // For fetch data
    const [displayData, setDisplayData] = useState({
        lessons: [],
        loading: true,
    });
    // For error handling
    const [error, setError] = useState("");

    const handleInput = (e) => {
        const { name, value } = e.target;
        setLessonData({
            ...lessonData,
            [name]: value,
        });
    };

    // Post data function
    const saveLesson = async (e) => {
        e.preventDefault();

        // Simple validation for required fields
        if (
            !lessonData.subjectName ||
            !lessonData.studyLevel ||
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
            subjectName: "",
            studyLevel: "",
            capacity: "",
            duration: "",
        });
        setError("");
    };

    // Fetch data function
    useEffect(() => {
        async function fetchLessons() {
            try {
                const res = await axios.get(
                    "http://127.0.0.1:8000/api/lessons"
                );

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
            <td colSpan="7">
                <h4>Loading...</h4>
            </td>
        </tr>
    ) : (
        displayData.lessons.map((item) => (
            <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.level_id}</td>
                <td>{item.subject_name}</td>
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
                    data-bs-target="#createSubjectModal"
                >
                    Create Subject
                </button>
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Level ID</th>
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
                id="createSubjectModal"
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
                            {/* Subject name input */}
                            <div className="mb-3">
                                <label className="form-label">
                                    Subject Name
                                </label>
                                <input
                                    type="text"
                                    name="subjectName"
                                    onChange={handleInput}
                                    value={lessonData.subjectName}
                                    className="form-control"
                                    required
                                />
                            </div>

                            {/* Study Level */}
                            <div className="mb-3">
                                <label className="form-label">
                                    Study Level
                                </label>
                                <select
                                    className="form-select"
                                    aria-label="Default select example"
                                    name="studyLevel"
                                    onChange={handleInput}
                                    required
                                >
                                    <option value="">
                                        --Please choose an option--
                                    </option>
                                    <option value="1">
                                        Pre & Lower Primary
                                    </option>
                                    <option value="2">Upper Primary</option>
                                </select>
                            </div>

                            {/* Capacity */}
                            <div className="mb-3">
                                <label className="form-label">Capacity</label>
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
