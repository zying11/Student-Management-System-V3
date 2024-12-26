import React, { useState, useEffect } from "react";
import axiosClient from "../axiosClient";
import Button from "../components/Button/Button";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import { Table } from "../components/Table/Table";
import ConfirmationModal from "../components/Modal/ConfirmationModal";
import "../css/Lesson.css";

export default function Lesson() {
    // Modal for user feedback
    const [modal, setModal] = useState({
        visible: false,
        message: "",
        type: "",
    });

    // Variable for fetching subject data
    const [subjects, setSubject] = useState([]);

    // Fetch subject data
    useEffect(() => {
        async function fetchSubjects() {
            try {
                const res = await axiosClient.get("/subjects");

                console.log(res.data.subjects);

                setSubject(res.data.subjects);
            } catch (error) {
                console.error("Error fetching subjects:", error);
            }
        }

        fetchSubjects();
    }, []);

    // Variable for fetching teacher data
    const [teachers, setTeacher] = useState([]);

    // Fetch teacher data
    useEffect(() => {
        async function fetchTeachers() {
            try {
                const res = await axiosClient.get("/teachers");

                // console.log(res.data.data); // Check data structure
                setTeacher(res.data.data);
                // console.log(teachers);
            } catch (error) {
                console.error("Error fetching teachers:", error);
            }
        }

        fetchTeachers();
    }, []);

    // Variable for posting lessons data
    const [lessonData, setLessonData] = useState({
        subjectId: "",
        teacherId: "",
        duration: "",
    });

    // Default values for add lesson
    useEffect(() => {
        setLessonData({
            subjectId: subjects[0]?.id || "", // Set the first subject's ID as the default
            teacherId: teachers[0]?.id || "", // Set the first teacher's ID as the default
            duration: "",
        });
    }, [subjects, teachers]);

    // Post lessons data
    const addLesson = async (e) => {
        e.preventDefault();

        // Simple validation for required fields
        if (
            !lessonData.subjectId ||
            !lessonData.teacherId ||
            !lessonData.duration
        ) {
            setError("Please fill in all fields");
            return;
        }

        try {
            const res = await axiosClient.post("/add-lesson", lessonData);
            // console.log(res.data);
            if (res.status === 200) {
                setModal({
                    visible: true,
                    message: "Lesson added successfully!",
                    type: "success",
                });
            }
        } catch (error) {
            console.error("Error:", error.response.data); //use err.response.data to display more info about the err
            setModal({
                visible: true,
                message: "There's a problem adding the lesson.",
                type: "error",
            });
        }

        setIsChange(!isChange);

        setTimeout(() => {
            setModal({ visible: false, message: "", type: "" });
        }, 3000);

        // Clear the form and error message
        setLessonData({
            subjectId: "",
            teacherId: "",
            duration: "",
        });
        setError("");
    };

    // Variable to update table instantly
    const [isChange, setIsChange] = useState(false);

    // Variable for fetching lesson data
    const [displayLesson, setDisplayLesson] = useState({
        lessons: [],
        loading: true,
    });

    // Fetch lessons data
    useEffect(() => {
        async function fetchLessons() {
            try {
                const res = await axiosClient.get("/timetable-lessons");
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
    }, [isChange]); // Dependency array should be an array of dependencies

    // Variable to catch selected lesson id for edit and delete purposes
    const [selectedLessonId, setSelectedLessonId] = useState(null);

    // Delete lesson data
    const handleDelete = async (id) => {
        try {
            const res = await axiosClient.delete(`/delete-lesson/${id}`);
            if (res.status === 200) {
                setModal({
                    visible: true,
                    message: "Lesson deleted successfully!",
                    type: "success",
                });
            }
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
            setModal({
                visible: true,
                message: "There's a problem deleting the lesson.",
                type: "error",
            });
        }
    };

    // Variables for edit lesson
    const [selectedLesson, setSelectedLesson] = useState(null);
    // Variable for displaying selected lessons data

    const [editLessonData, setEditLessonData] = useState({
        subjectId: "",
        teacherId: "",
        duration: "",
    });

    // Update this effect to search for the lesson when selectedLessonId changes
    useEffect(() => {
        if (selectedLessonId) {
            const lesson = displayLesson.lessons.find(
                (lesson) => lesson.id === selectedLessonId
            );

            // Check if lesson is found before setting the state
            // else there will be prob after deleting the lesson
            if (lesson) {
                setSelectedLesson(lesson);

                setEditLessonData({
                    teacherId: lesson.teacher_id || "",
                });
            } else {
                // Handle the case where the lesson is not found (optional)
                console.warn("Lesson not found for the selectedLessonId");
                setEditLessonData({
                    teacherId: "",
                });
            }
        }
    }, [selectedLessonId, displayLesson.lessons]);

    const editLesson = async (e) => {
        e.preventDefault();
        // console.log(lessonData.teacher);

        try {
            const res = await axiosClient.put(
                `/edit-lesson/${selectedLesson.id}`,
                { teacher: editLessonData.teacherId }
            );

            if (res.status === 200) {
                // alert("Lesson updated successfully!");
                setModal({
                    visible: true,
                    message: "Lesson updated successfully!",
                    type: "success",
                });
            }

            setIsChange(!isChange);
        } catch (error) {
            console.error("Error updating lesson:", error.response.data);
            setModal({
                visible: true,
                message: "There's a problem updating the lesson.",
                type: "error",
            });
        }

        setTimeout(() => {
            setModal({ visible: false, message: "", type: "" });
        }, 3000);
    };

    // Error handling
    const [error, setError] = useState("");

    // Generalized handleInput function
    const handleInput = (setterFunction) => (e) => {
        // Destructure name and value from the event target (the input element that triggered the change)
        const { name, value } = e.target;

        // Update data state
        setterFunction((prevData) => ({
            // Spread the previous state to retain all existing values
            ...prevData,
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
        "Room",
        "Actions",
    ];

    const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    const tableData = displayLesson.loading
        ? [
              [
                  <td colSpan="8">
                      <div className="d-flex justify-content-center align-items-center loader-container">
                          <div>Loading</div>
                      </div>
                  </td>,
              ],
          ]
        : displayLesson.lessons.map((lesson) => [
              lesson.id,
              lesson.subject?.subject_name || "-",
              lesson.subject.study_level.level_name || "-",
              lesson.teacher.user.name || "-",
              daysOfWeek[lesson.day] || "-",
              lesson.start_time || "-",
              lesson.end_time || "-",
              lesson.room?.room_name || "-", // ?. for null check
              <div className="actions">
                  <img
                      className="me-2 mb-xl-0 mb-2"
                      src="http://localhost:8000/icon/edit.png"
                      alt="Edit"
                      data-bs-toggle="modal"
                      data-bs-target="#editLessonModal"
                      onClick={() => {
                          setSelectedLessonId(lesson.id);
                          setIsChange(!isChange);
                      }}
                      style={{ cursor: "pointer" }}
                  />
                  <img
                      className="me-2"
                      src="http://localhost:8000/icon/delete.png"
                      alt="Delete"
                      data-bs-toggle="modal"
                      data-bs-target="#confirmationModal"
                      onClick={() => {
                          setSelectedLessonId(lesson.id);
                          setIsChange(!isChange);
                      }}
                      style={{ cursor: "pointer" }}
                  />
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
                <Table
                    header={tableHeader}
                    data={tableData}
                    itemsPerPage={10}
                ></Table>
            </ContentContainer>
            <div
                id="editLessonModal"
                className="modal fade"
                tabindex="-1"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                aria-labelledby="editLessonModal"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit a Lesson</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        {error && (
                            <div className="alert alert-danger">{error}</div>
                        )}
                        <form
                            className="p-3"
                            method="post"
                            onSubmit={editLesson}
                        >
                            {/* Subject */}
                            <div className="mb-3">
                                <label className="form-label">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={
                                        selectedLesson?.subject?.subject_name ||
                                        "-"
                                    }
                                    className="form-control"
                                    disabled
                                />
                            </div>

                            {/* Teacher */}
                            <div className="mb-3">
                                <label className="form-label">Teacher</label>
                                <select
                                    name="teacherId"
                                    onChange={handleInput(setEditLessonData)}
                                    value={editLessonData.teacherId}
                                    className="form-control"
                                    required
                                >
                                    {teachers.map((teacher) => (
                                        <option
                                            key={teacher.id}
                                            value={teacher.id}
                                        >
                                            {teacher.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Duration */}
                            <div className="mb-3">
                                <label className="form-label">Duration</label>
                                <input
                                    type="number"
                                    name="duration"
                                    onChange={handleInput(setEditLessonData)}
                                    value={selectedLesson?.duration}
                                    className="form-control"
                                    disabled
                                />
                            </div>

                            {/* Start Time */}
                            <div className="mb-3">
                                <label className="form-label">Start Time</label>
                                <input
                                    type="time"
                                    name="startTime"
                                    value={selectedLesson?.start_time || "-"}
                                    className="form-control"
                                    disabled
                                />
                            </div>

                            {/* End Time */}
                            <div className="mb-3">
                                <label className="form-label">End Time</label>
                                <input
                                    type="time"
                                    name="endTime"
                                    value={selectedLesson?.end_time || "-"}
                                    className="form-control"
                                    disabled
                                />
                            </div>

                            {/* Room */}
                            <div className="mb-3">
                                <label className="form-label">Room</label>
                                <input
                                    type="text"
                                    name="roomName"
                                    value={
                                        selectedLesson?.room?.room_name || "-"
                                    }
                                    className="form-control"
                                    disabled
                                />
                            </div>

                            <div className="button-container d-flex justify-content-end gap-3">
                                <Button color="yellow" data-bs-dismiss="modal">
                                    Save
                                </Button>
                                <Button data-bs-dismiss="modal">Cancel</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div
                id="createLessonModal"
                className="modal fade"
                tabindex="-1"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                aria-labelledby="createLessonModal"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Create a Lesson</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        {error && (
                            <div className="alert alert-danger">{error}</div>
                        )}
                        <form
                            className="p-3"
                            method="post"
                            onSubmit={addLesson}
                        >
                            {/* Subject input */}
                            <div className="mb-3">
                                <label className="form-label">Subject</label>
                                <select
                                    name="subjectId"
                                    onChange={handleInput(setLessonData)}
                                    value={lessonData.subjectId}
                                    className="form-control"
                                    required
                                >
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
                            {/* Teacher*/}
                            <div className="mb-3">
                                <label className="form-label">Teacher</label>
                                <select
                                    name="teacherId"
                                    onChange={handleInput(setLessonData)}
                                    value={lessonData.teacherId}
                                    className="form-control"
                                    required
                                >
                                    {teachers.map((teacher) => (
                                        <option
                                            key={teacher.id}
                                            value={teacher.id}
                                        >
                                            {teacher.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Duration */}
                            <div className="mb-3">
                                <label className="form-label">Duration</label>
                                <input
                                    type="number"
                                    name="duration"
                                    onChange={handleInput(setLessonData)}
                                    value={lessonData.duration}
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="button-container d-flex justify-content-end gap-3">
                                <Button color="yellow" data-bs-dismiss="modal">
                                    Create
                                </Button>
                                <Button data-bs-dismiss="modal">Cancel</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {modal.visible && (
                <div className={`modal-feedback ${modal.type}`}>
                    <p>{modal.message}</p>
                </div>
            )}

            <ConfirmationModal
                id="confirmationModal"
                icon="tick.png"
                headerText="Delete Lesson?"
                bodyText="Are you sure you want to delete this lesson?"
                onConfirm={() => handleDelete(selectedLessonId)}
            />
        </>
    );
}
