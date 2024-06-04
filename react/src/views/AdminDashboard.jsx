import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/AdminDashboard.css";

export default function AdminDashboard() {
    const [centerProfile, setCenterProfile] = useState({
        numRooms: "",
    });

    const [subjects, setSubjects] = useState([]);
    const [newSubject, setNewSubject] = useState({
        studyLevel: "",
        subjectName: "",
    });

    // Fetch data for no of physical rooms
    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await axios.get(
                    "http://127.0.0.1:8000/api/center-profile"
                );

                console.log(res.data.centerProfile[0]);
                // Ensure the fetched data matches the state structure
                setCenterProfile({
                    numRooms: res.data.centerProfile[0].num_rooms,
                });
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        }

        fetchProfile();
    }, []);

    // Fetch subject data
    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await axios.get(
                    "http://127.0.0.1:8000/api/subjects"
                );
                setSubjects(res.data.subjects);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        }

        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSubject((prevSubject) => ({
            ...prevSubject,
            [name]: value,
        }));
    };

    // Post subject data
    const insertSubject = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                "http://127.0.0.1:8000/api/add-subject",
                newSubject
            );
            console.log(res.data);
        } catch (error) {
            console.error("Error:", error.response.data); //use err.response.data to display more info about the err
        }

        // Clear the form and error message
        setNewSubject({
            studyLevel: "",
            subjectName: "",
        });
    };

    return (
        <>
            <div className="p-4">
                <h2>Admin Dashboard</h2>
                <div className="d-flex gap-3">
                    <div className="data-container d-flex gap-3 p-3">
                        <div className="icon">
                            <i className="bi bi-people-fill"></i>
                        </div>
                        <div className="text">
                            <p className="">Students</p>
                            <h3 className="">0</h3>
                        </div>
                    </div>
                    <div className="data-container d-flex gap-3 p-3">
                        <div className="icon">
                            <i className="bi bi-people-fill"></i>
                        </div>
                        <div className="text">
                            <p className="">Teachers</p>
                            <h3 className="">0</h3>
                        </div>
                    </div>
                    <div className="data-container d-flex gap-3 p-3">
                        <div className="icon">
                            <i className="bi bi-door-open-fill"></i>
                        </div>
                        <div className="text">
                            <p className="">No of Physical Rooms</p>
                            <h3 className="">{centerProfile.numRooms}</h3>
                        </div>
                    </div>
                    <div className="data-container d-flex gap-3 p-3">
                        <div className="icon">
                            <i className="bi bi-book-half"></i>
                        </div>
                        <div className="text">
                            <p className="">No of Subjects</p>
                            <h3 className="">{subjects.length}</h3>
                        </div>
                    </div>
                </div>
                <div className="mt-5">
                    <div className="subject-container">
                        <h4>Subjects</h4>
                        <button
                            type="button"
                            className="btn btn-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#createSubjectModal"
                        >
                            Insert Subject
                        </button>
                        <table className="table mt-3">
                            <thead>
                                <tr>
                                    <th scope="col">Study Year</th>
                                    <th scope="col">Subject Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjects.map((subject, index) => (
                                    <tr key={index}>
                                        <td>{subject.study_level}</td>
                                        <td>{subject.subject_name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Bootstrap Modal */}
            <div
                id="createSubjectModal"
                className="modal fade"
                tabindex="-1"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Insert Subject</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form method="post" onSubmit={insertSubject}>
                                <div className="mb-3">
                                    <label
                                        htmlFor="studyLevel"
                                        className="form-label"
                                    >
                                        Study Year
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="studyLevel"
                                        name="studyLevel"
                                        value={newSubject.studyLevel}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="subjectName"
                                        className="form-label"
                                    >
                                        Subject Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="subjectName"
                                        name="subjectName"
                                        value={newSubject.subjectName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Add Subject
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
