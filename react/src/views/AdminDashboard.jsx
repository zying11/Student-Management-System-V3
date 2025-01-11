import React, { useState, useEffect } from "react";
import OverviewItem from "../components/ContentContainer/OverviewItem";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import { Table } from "../components/Table/Table";
import Button from "../components/Button/Button";
import ConfirmationModal from "../components/Modal/ConfirmationModal";
import PieChart from "../components/Chart/PieChart";
import axiosClient from "../axiosClient";
import "../css/AdminDashboard.css";

export default function AdminDashboard() {
    // Error handling
    const [error, setError] = useState("");

    // Modal for user feedback
    const [modal, setModal] = useState({
        visible: false,
        message: "",
        type: "",
    });

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

    // Variable to update table instantly
    const [isChange, setIsChange] = useState(false);

    // Overview Item Data
    // Get student record
    const [studentCount, setStudentCount] = useState(0);

    const [maleCount, setMaleCount] = useState(0);
    const [femaleCount, setFemaleCount] = useState(0);

    useEffect(() => {
        // Fetch the number of students
        const fetchStudentCount = async () => {
            try {
                const res = await axiosClient.get("/student-count");
                setStudentCount(res.data.total);
                setMaleCount(res.data.male);
                setFemaleCount(res.data.female);
            } catch (error) {
                console.error("Error fetching student count:", error);
            }
        };

        fetchStudentCount();
    }, []);

    // Get teacher record
    const [teacherCount, setTeacherCount] = useState(0);

    useEffect(() => {
        // Fetch the number of teachers
        const fetchTeacherCount = async () => {
            try {
                const res = await axiosClient.get("/teacher-count");
                setTeacherCount(res.data.count);
            } catch (error) {
                console.error("Error fetching teacher count:", error);
            }
        };

        fetchTeacherCount();
    }, []);

    // Get room record
    const [roomCount, setRoomCount] = useState(0);

    useEffect(() => {
        // Fetch the number of rooms
        const fetchRoomCount = async () => {
            try {
                const res = await axiosClient.get("/room-count");
                setRoomCount(res.data.count);
            } catch (error) {
                console.error("Error fetching room count:", error);
            }
        };

        fetchRoomCount();
    }, []);

    // Get subject record
    const [subjectCount, setSubjectCount] = useState(0);

    useEffect(() => {
        // Fetch the number of rooms
        const fetchSubjectCount = async () => {
            try {
                const res = await axiosClient.get("/subject-count");
                setSubjectCount(res.data.count);
            } catch (error) {
                console.error("Error fetching student count:", error);
            }
        };

        fetchSubjectCount();
    }, [isChange]);

    // Study Level Table
    // Variable for fetching study level data
    const [displayStudyLevel, setDisplayStudyLevel] = useState({
        studyLevels: [],
        loading: true,
    });

    // Fetch study level data
    useEffect(() => {
        async function fetchStudyLevels() {
            try {
                const res = await axiosClient.get("/study-levels");

                // console.log(res.data.studyLevels);

                setDisplayStudyLevel({
                    studyLevels: res.data.studyLevels,
                    loading: false,
                });
            } catch (error) {
                console.error("Error fetching subjects:", error);
            }
        }

        fetchStudyLevels();
    }, [isChange]);

    // Variable for posting new study level data
    const [studyLevelData, setStudyLevelData] = useState({
        levelName: "",
    });

    // Post study level data
    const addStudyLevel = async (e) => {
        e.preventDefault();

        // Simple validation for required fields
        if (!studyLevelData.levelName) {
            setError("Please fill in all fields");
            return;
        }

        try {
            const res = await axiosClient.post(
                "/add-study-level",
                studyLevelData
            );
            // console.log(res.data);

            if (res.status === 200) {
                setModal({
                    visible: true,
                    message: "Study Level added successfully!",
                    type: "success",
                });
            }
        } catch (error) {
            console.error("Error:", error.response.data); //use err.response.data to display more info about the err
            setModal({
                visible: true,
                message: "There's a problem adding the study level",
                type: "error",
            });
        }

        setIsChange(!isChange);
        setTimeout(() => {
            setModal({ visible: false, message: "", type: "" });
        }, 3000);

        // Clear the form and error message
        setStudyLevelData({
            levelName: "",
        });
        setError("");
    };

    // Variable to catch selected subject id for edit and delete purposes
    const [selectedStudyLevelId, setSelectedStudyLevelId] = useState(null);

    // Delete study level data
    const handleStudyLevelDelete = async (id) => {
        try {
            const res = await axiosClient.delete(`/delete-study-level/${id}`);
            // console.log(res.data);
            // Check if the status code is 200
            if (res.status === 200) {
                setModal({
                    visible: true,
                    message: "Study Level deleted successfully!",
                    type: "success",
                });
            }
            setDisplayStudyLevel((prevData) => {
                if (Array.isArray(prevData.studyLevels)) {
                    return {
                        ...prevData,
                        // Creates a new array by including only those subjects for which the condition (subject.id !== id) is true.
                        studyLevels: prevData.studyLevels.filter(
                            (studyLevel) => studyLevel.id !== id
                        ),
                    };
                }

                return prevData; // Return the previous state if it's not an array
            });
        } catch (error) {
            console.error("Error deleting study level:", error);
            setModal({
                visible: true,
                message: "Study Level deleting study level!",
                type: "success",
            });
        }

        setTimeout(() => {
            setModal({ visible: false, message: "", type: "" });
        }, 3000);
    };

    //Study level table data
    const studyLevelHeader = ["Level Name", "Actions"];

    const studyLevelTableData = displayStudyLevel.loading
        ? [
              [
                  <td colSpan="8">
                      <div className="d-flex justify-content-center align-items-center loader-container">
                          <div>Loading</div>
                      </div>
                  </td>,
              ],
          ]
        : displayStudyLevel.studyLevels.map((studyLevel) => [
              studyLevel.level_name || "-",

              <div className="actions">
                  <img
                      className="me-2"
                      src="/icon/delete.png"
                      alt="Delete"
                      data-bs-toggle="modal"
                      data-bs-target="#confirmationStudyLevel"
                      onClick={() => {
                          setSelectedStudyLevelId(studyLevel.id);
                          setIsChange(!isChange);
                      }}
                      style={{ cursor: "pointer" }}
                  />
              </div>,
          ]);

    // Subject Table
    // Variable for fetching subject data
    const [displaySubject, setDisplaySubject] = useState({
        subjects: [],
        loading: true,
    });

    // Fetch subject data
    useEffect(() => {
        async function fetchSubjects() {
            try {
                const res = await axiosClient.get("/subjects");

                // console.log(res.data.subjects);

                setDisplaySubject({
                    subjects: res.data.subjects,
                    loading: false,
                });
            } catch (error) {
                console.error("Error fetching subjects:", error);
            }
        }

        fetchSubjects();
    }, [isChange]);

    // Variable to catch selected subject id for edit and delete purposes
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);

    // Delete subject data
    const handleSubjectDelete = async (id) => {
        try {
            const res = await axiosClient.delete(`/delete-subject/${id}`);
            // console.log(res.data);

            if (res.status === 200) {
                setModal({
                    visible: true,
                    message: "Subject deleted successfully!",
                    type: "success",
                });
            }

            setDisplaySubject((prevData) => {
                if (Array.isArray(prevData.subjects)) {
                    return {
                        ...prevData,
                        // Creates a new array by including only those subjects for which the condition (subject.id !== id) is true.
                        subjects: prevData.subjects.filter(
                            (subject) => subject.id !== id
                        ),
                    };
                }

                return prevData; // Return the previous state if it's not an array
            });
        } catch (error) {
            console.error("Error deleting subject:", error);
            setModal({
                visible: true,
                message: "There's a problem deleting the subject.",
                type: "error",
            });
        }

        setTimeout(() => {
            setModal({ visible: false, message: "", type: "" });
        }, 3000);
    };

    // Variable for posting subject data
    const [subjectData, setSubjectData] = useState({
        subjectName: "",
        levelId: "",
        subjectFee: "",
    });

    // Post subjects data
    const addSubject = async (e) => {
        e.preventDefault();

        // Simple validation for required fields
        if (
            !subjectData.subjectName ||
            !subjectData.levelId ||
            !subjectData.subjectFee
        ) {
            setError("Please fill in all fields");
            return;
        }

        try {
            const res = await axiosClient.post("/add-subject", subjectData);
            // console.log(res.data);
            if (res.status === 200) {
                setModal({
                    visible: true,
                    message: "Subject added successfully!",
                    type: "success",
                });
            }
        } catch (error) {
            console.error("Error:", error.response.data); //use err.response.data to display more info about the err
            setModal({
                visible: true,
                message: "There's a problem adding the subject.",
                type: "error",
            });
        }

        setIsChange(!isChange);

        setTimeout(() => {
            setModal({ visible: false, message: "", type: "" });
        }, 3000);

        // Clear the form and error message
        setSubjectData({
            subjectName: "",
            levelId: "",
            subjectFee: "",
        });
        setError("");
    };

    // Variable for updating subject data
    const [updateSubjectData, setUpdateSubjectData] = useState({
        subjectName: "",
        levelId: "",
        subjectFee: "",
    });

    // Update this effect to search for the subject when selectedSubjectId changes
    useEffect(() => {
        // console.log(selectedSubjectId);
        if (selectedSubjectId) {
            const subject = displaySubject.subjects.find(
                (subject) => subject.id === selectedSubjectId
            );

            console.log(displaySubject.subjects);
            console.log(subject);

            // Set to current subject data for posting edited subject purposes
            setUpdateSubjectData({
                subjectName: subject.subject_name,
                levelId: subject.level_id,
                subjectFee: subject.subject_fee,
            });
        }
    }, [selectedSubjectId]);

    // Edit subject
    const editSubject = async (e) => {
        e.preventDefault();
        // console.log(updateSubjectData);
        // console.log(selectedSubjectId);
        try {
            const res = await axiosClient.put(
                `/edit-subject/${selectedSubjectId}`,
                updateSubjectData
            );
            if (res.status === 200) {
                setModal({
                    visible: true,
                    message: "Subject updated successfully!",
                    type: "success",
                });
            }
            setIsChange(!isChange);
        } catch (error) {
            console.error("Error:", error.response.data);
            setModal({
                visible: true,
                message: "There's a problem updating the subject.",
                type: "error",
            });
        }
        setTimeout(() => {
            setModal({ visible: false, message: "", type: "" });
        }, 3000);
    };

    const subjectHeader = ["Subject Name", "Study Year", "Fee", "Action"];

    const subjectTableData = displaySubject.loading
        ? [
              [
                  <td colSpan="8">
                      <div className="d-flex justify-content-center align-items-center loader-container">
                          <div>Loading</div>
                      </div>
                  </td>,
              ],
          ]
        : displaySubject.subjects.map((subject) => [
              subject.subject_name || "-",
              subject.level_name || "-",
              subject.subject_fee || "-",

              <div className="actions">
                  <img
                      className="me-sm-2 me-0 mb-sm-0 mb-2"
                      src="/icon/edit.png"
                      alt="Edit"
                      data-bs-toggle="modal"
                      data-bs-target="#editSubjectModal"
                      onClick={() => {
                          setSelectedSubjectId(subject.id);
                          setIsChange(!isChange);
                      }}
                      style={{ cursor: "pointer" }}
                  />
                  <img
                      className="me-2"
                      src="/icon/delete.png"
                      alt="Delete"
                      data-bs-toggle="modal"
                      data-bs-target="#confirmationSubject"
                      onClick={() => {
                          setSelectedSubjectId(subject.id);
                          setIsChange(!isChange);
                      }}
                      style={{ cursor: "pointer" }}
                  />
              </div>,
          ]);

    //
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 400);

    // Media query for Pie Chart
    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth > 400);
        };

        window.addEventListener("resize", handleResize);

        // Clean up event listener
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            <div className="page-title">Admin Dashboard</div>
            <div className="wrapper d-flex flex-column">
                <div className="first-row d-flex gap-3 flex-wrap justify-content-between mt-3">
                    <OverviewItem
                        iconSrc="student-num.png"
                        title="Student"
                        text={studentCount}
                        lineColor="#904dbc"
                    ></OverviewItem>
                    <OverviewItem
                        iconSrc="teacher-num.png"
                        title="Teachers"
                        text={teacherCount}
                        lineColor="#EE6137"
                    ></OverviewItem>
                    <OverviewItem
                        iconSrc="room-num.png"
                        title="Physical Room"
                        text={roomCount}
                        lineColor="#0D6EFD"
                    ></OverviewItem>
                    <OverviewItem
                        iconSrc="subject-num.png"
                        title="Subjects"
                        text={subjectCount}
                        lineColor="#FF0000"
                    ></OverviewItem>
                </div>
                <div className="second-row d-flex flex-wrap gap-3 mt-3">
                    {/* <ContentContainer title="Students Gender">
                        {isLargeScreen ? (
                            <PieChart
                                maleCount={maleCount}
                                femaleCount={femaleCount}
                            />
                        ) : (
                            <p>
                                Screen size is too small. Please switch to a
                                bigger screen size to view the chart.
                            </p>
                        )}
                    </ContentContainer> */}
                    <ContentContainer title="Study Level" className="flex-fill">
                        <div className="d-flex justify-content-end mb-3">
                            <Button
                                data-bs-toggle="modal"
                                data-bs-target="#addStudyLevelModal"
                                color="yellow"
                            >
                                Add Study Level
                            </Button>
                        </div>
                        <Table
                            header={studyLevelHeader}
                            data={studyLevelTableData}
                            itemsPerPage="5"
                        ></Table>
                    </ContentContainer>
                    <ContentContainer
                        title="Subjects Offered"
                        className="flex-fill"
                    >
                        <div className="d-flex justify-content-end mb-3">
                            <Button
                                data-bs-toggle="modal"
                                data-bs-target="#addSubjectModal"
                                color="yellow"
                            >
                                Add Subject
                            </Button>
                        </div>
                        <Table
                            header={subjectHeader}
                            data={subjectTableData}
                            itemsPerPage="5"
                        ></Table>
                    </ContentContainer>
                </div>
            </div>

            <div
                id="addStudyLevelModal"
                className="modal fade"
                tabindex="-1"
                aria-labelledby="addStudyLevelModal"
                data-bs-backdrop="static"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add a Study Level</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        {error && (
                            <div className="alert alert-danger m-2">
                                {error}
                            </div>
                        )}
                        <form
                            className="p-3"
                            method="post"
                            onSubmit={addStudyLevel}
                        >
                            <div className="mb-3">
                                <label className="form-label">
                                    Study Level
                                </label>
                                <input
                                    type="text"
                                    onChange={handleInput(setStudyLevelData)}
                                    className="form-control"
                                    name="levelName"
                                    value={studyLevelData.levelName}
                                ></input>
                            </div>

                            <div className="button-container d-flex justify-content-end gap-3">
                                <Button
                                    type="submit"
                                    color="yellow"
                                    data-bs-dismiss="modal"
                                >
                                    Add
                                </Button>
                                <Button type="button" data-bs-dismiss="modal">
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div
                id="addSubjectModal"
                className="modal fade subject-modal"
                tabindex="-1"
                data-bs-keyboard="false"
                data-bs-backdrop="static"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add a Subject</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        {error && (
                            <div className="alert alert-danger m-2">
                                {error}
                            </div>
                        )}
                        <form
                            className="p-3"
                            method="post"
                            onSubmit={addSubject}
                        >
                            {/* Subject Name */}
                            <div className="mb-3">
                                <label className="form-label">Subject</label>
                                <input
                                    type="text"
                                    onChange={handleInput(setSubjectData)}
                                    className="form-control"
                                    name="subjectName"
                                    value={subjectData.subjectName}
                                ></input>
                            </div>
                            {/* Study Level*/}
                            <div className="mb-3">
                                <label className="form-label">
                                    Study Level
                                </label>
                                <select
                                    name="levelId"
                                    onChange={handleInput(setSubjectData)}
                                    value={subjectData.levelId}
                                    className="form-control"
                                    required
                                >
                                    {displayStudyLevel.studyLevels.map(
                                        (studyLevel) => (
                                            <option
                                                key={studyLevel.id}
                                                value={studyLevel.id}
                                            >
                                                {studyLevel.level_name}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                            {/* Subject Fee */}
                            <div className="mb-3">
                                <label className="form-label">
                                    Subject Fee
                                </label>
                                <input
                                    type="number"
                                    onChange={handleInput(setSubjectData)}
                                    className="form-control"
                                    name="subjectFee"
                                    value={subjectData.subjectFee}
                                ></input>
                            </div>

                            <div className="button-container d-flex justify-content-end gap-3">
                                <Button
                                    type="submit"
                                    data-bs-dismiss="modal"
                                    color="yellow"
                                >
                                    Add
                                </Button>
                                <Button type="button" data-bs-dismiss="modal">
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div
                id="editSubjectModal"
                className="modal fade edit-subject-modal"
                tabIndex="-1"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit a Subject</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        {error && (
                            <div className="alert alert-danger m-2">
                                {error}
                            </div>
                        )}
                        <form className="p-3" onSubmit={editSubject}>
                            {/* Subject Name */}
                            <div className="mb-3">
                                <label className="form-label">Subject</label>
                                <input
                                    type="text"
                                    onChange={handleInput(setUpdateSubjectData)}
                                    className="form-control"
                                    name="subjectName"
                                    value={updateSubjectData.subjectName}
                                ></input>
                            </div>

                            {/* Study Level */}
                            <div className="mb-3">
                                <label className="form-label">
                                    Study Level
                                </label>
                                <select
                                    name="levelId"
                                    onChange={handleInput(setUpdateSubjectData)}
                                    value={updateSubjectData.levelId} //use level id instead of level name
                                    className="form-control"
                                    required
                                >
                                    {displayStudyLevel.studyLevels.map(
                                        (studyLevel) => (
                                            <option
                                                key={studyLevel.id}
                                                value={studyLevel.id}
                                            >
                                                {studyLevel.level_name}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {/* Subject Fee */}
                            <div className="mb-3">
                                <label className="form-label">
                                    Subject Fee
                                </label>
                                <input
                                    type="number"
                                    onChange={handleInput(setUpdateSubjectData)}
                                    className="form-control"
                                    name="subjectFee"
                                    value={updateSubjectData.subjectFee}
                                ></input>
                            </div>

                            <div className="button-container d-flex justify-content-end gap-3">
                                <Button
                                    type="submit"
                                    className="btn"
                                    data-bs-dismiss="modal"
                                >
                                    Save
                                </Button>
                                <Button
                                    type="button"
                                    className="btn"
                                    color="yellow"
                                    data-bs-dismiss="modal"
                                >
                                    Cancel
                                </Button>
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
                id="confirmationStudyLevel"
                icon="tick.png"
                headerText="Delete Study Level?"
                bodyText="Are you sure you want to delete this study level?"
                onConfirm={() => handleStudyLevelDelete(selectedStudyLevelId)}
            />

            <ConfirmationModal
                id="confirmationSubject"
                icon="tick.png"
                headerText="Delete Subject?"
                bodyText="Are you sure you want to delete this subject?"
                onConfirm={() => handleSubjectDelete(selectedSubjectId)}
            />
        </>
    );
}
