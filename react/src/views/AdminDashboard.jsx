import React, { useState, useEffect } from "react";
import OverviewItem from "../components/ContentContainer/OverviewItem";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import { Table } from "../components/Table/Table";
import ConfirmationModal from "../components/Modal/ConfirmationModal";
import axios from "axios";
import "../css/AdminDashboard.css";

export default function AdminDashboard() {
    // Overview Item Data
    // Get student record
    const [studentCount, setStudentCount] = useState(0);

    useEffect(() => {
        // Fetch the number of students
        const fetchStudentCount = async () => {
            try {
                const res = await axios.get(
                    "http://127.0.0.1:8000/api/student-count"
                );
                setStudentCount(res.data.count);
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
                const res = await axios.get(
                    "http://127.0.0.1:8000/api/teacher-count"
                );
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
                const res = await axios.get(
                    "http://127.0.0.1:8000/api/room-count"
                );
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
                const res = await axios.get(
                    "http://127.0.0.1:8000/api/subject-count"
                );
                setSubjectCount(res.data.count);
            } catch (error) {
                console.error("Error fetching student count:", error);
            }
        };

        fetchSubjectCount();
    }, []);

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
                const res = await axios.get(
                    "http://127.0.0.1:8000/api/subjects"
                );

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
    }, []);

    const subjectHeader = ["Subject Name", "Study Year", "Action"];

    const subjectData = displaySubject.loading
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

              <div className="actions">
                  <img
                      className="me-2"
                      src="http://localhost:8000/icon/edit.png"
                      alt="Edit"
                      data-bs-toggle="modal"
                      data-bs-target="#editLessonModal"
                      style={{ cursor: "pointer" }}
                  />
                  <img
                      className="me-2"
                      src="http://localhost:8000/icon/delete.png"
                      alt="Delete"
                      data-bs-toggle="modal"
                      data-bs-target="#confirmationModal"
                      onClick={() => {
                          setSelectedSubjectId(subject.id);
                          // setIsChange(!isChange);
                      }}
                      style={{ cursor: "pointer" }}
                  />
              </div>,
          ]);

    // Variable to catch selected subject id for edit and delete purposes
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);

    // Delete lesson data
    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(
                `http://127.0.0.1:8000/api/delete-subject/${id}`
            );
            console.log(res.data);
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
            console.error("Error deleting lesson:", error);
        }
    };

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
                    <ContentContainer title="Subjects Offered">
                        <Table
                            header={subjectHeader}
                            data={subjectData}
                            itemsPerPage="5"
                        ></Table>
                    </ContentContainer>
                    <ContentContainer title="Students Gender"></ContentContainer>
                </div>
            </div>
            <ConfirmationModal
                id="confirmationModal"
                icon="tick.png"
                headerText="Delete Subject?"
                bodyText="Are you sure you want to delete this subject?"
                onConfirm={() => handleDelete(selectedSubjectId)}
            />
        </>
    );
}
