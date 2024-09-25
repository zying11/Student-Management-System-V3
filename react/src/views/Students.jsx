import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axiosClient";
import Button from "../components/Button/Button";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import { Table } from "../components/Table/Table";

export default function Students() {
    const [studentData, setStudentData] = useState({
        students: [],
        loading: true,
    });

    const [error, setError] = useState("");

    // Fetch students data
    useEffect(() => {
        async function fetchStudents() {
            try {
                // Fetch data from /students endpoint
                const res = await axiosClient.get("/students");
                setStudentData({
                    students: res.data.data,
                    loading: false,
                });
            } catch (error) {
                console.error("Error fetching students:", error);
                setStudentData({
                    students: [],
                    loading: false,
                });
                setError(
                    "Error fetching student data. Please try again later."
                );
            }
        }

        // Call fetchStudents function
        fetchStudents();
    }, []);

    // Handle deletion of a student
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this student?")) {
            return;
        }
        try {
            // Delete student with the given ID
            await axiosClient.delete(`/students/${id}`);
            // Update state to remove the deleted student
            setStudentData((prevState) => ({
                ...prevState,
                students: prevState.students.filter(
                    (student) => student.id !== id
                ),
            }));
        } catch (error) {
            console.error("Error deleting student:", error);
            setError("Error deleting student. Please try again later.");
        }
    };

    const tableHeader = [
        "ID",
        "Student Name",
        "Subject",
        "Study Level",
        "Registration Date",
        "Actions",
    ];

    const tableData = studentData.loading
        ? [
              [
                  <td key="loading" colSpan="6" className="text-center">
                      Loading...
                  </td>,
              ],
          ]
        : studentData.students.map((student) => [
              student.id || "-",
              student.name || "-",
              student.enrollments.length > 0
                  ? student.enrollments.map((enrollment, index) => (
                        <span key={index}>
                            {enrollment.subject?.subject_name || "-"} <br />
                        </span>
                    ))
                  : "-",
              student.enrollments.length > 0
                  ? student.enrollments.map((enrollment, index) => (
                        <span key={index}>
                            {enrollment.study_level?.level_name || "-"} <br />
                        </span>
                    ))
                  : "-",
              student.registration_date || "-",
              <div className="actions">
                  {/*Edit action*/}
                  <Link
                      to={`/student/edit/${student.id}`}
                      className="text-decoration-none"
                  >
                      <img
                          className="me-2"
                          src="http://localhost:8000/icon/edit.png"
                          alt="Edit"
                      />
                  </Link>
                  {/*Delete action*/}
                  <img
                      className="me-2"
                      src="http://localhost:8000/icon/delete.png"
                      alt="Delete"
                      onClick={() => handleDelete(student.id)}
                      style={{ cursor: "pointer" }}
                  />
                  {/*Profile action*/}
                  <Link
                      to={`/student/${student.id}/profile`}
                      className="text-decoration-none"
                  >
                      <img
                          className="me-2"
                          src="http://localhost:8000/icon/profile.png"
                          alt="Profile"
                      />
                  </Link>
              </div>,
          ]);

    return (
        <>
            <div className="page-title">Students</div>
            <div className="d-flex justify-content-end">
                <Link to="/student/create" className="text-decoration-none">
                    <Button>Add Student</Button>
                </Link>
            </div>
            <ContentContainer title="Student List">
                {error && <div className="alert alert-danger">{error}</div>}
                <Table
                    header={tableHeader}
                    data={tableData}
                    itemsPerPage={10}
                />
            </ContentContainer>
        </>
    );
}
