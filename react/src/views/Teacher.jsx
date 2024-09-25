import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axiosClient";
import Button from "../components/Button/Button";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import { Table } from "../components/Table/Table";

export default function Teacher() {
    const [teacherData, setTeacherData] = useState({
        teachers: [],
        loading: true,
    });

    const [error, setError] = useState("");

    // Fetch teacher data
    useEffect(() => {
        async function fetchTeachers() {
            try {
                // Fetch data from /teachers endpoint
                const res = await axiosClient.get("/teachers");
                setTeacherData({
                    teachers: res.data.data,
                    loading: false,
                });
            } catch (error) {
                console.error("Error fetching teachers:", error);
                setTeacherData({
                    teachers: [],
                    loading: false,
                });
                setError(
                    "Error fetching teacher data. Please try again later."
                );
            }
        }

        // Call fetchTeachers function
        fetchTeachers();
    }, []);

    // Handle deletion of a teacher
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this teacher?")) {
            return;
        }
        try {
            // Delete teacher with the given ID
            await axiosClient.delete(`/teachers/${id}`);
            // Update state to remove the deleted teacher
            setTeacherData((prevState) => ({
                ...prevState,
                teachers: prevState.teachers.filter(
                    (teacher) => teacher.id !== id
                ),
            }));
        } catch (error) {
            console.error("Error deleting teacher:", error);
            setError("Error deleting teacher. Please try again later.");
        }
    };

    const tableHeader = [
        "ID",
        "Teacher Name",
        "Subject Teaching",
        "Email",
        "Joining Date",
        "Actions",
    ];

    const tableData = teacherData.loading
        ? [
              [
                  <td key="loading" colSpan="6" className="text-center">
                      Loading...
                  </td>,
              ],
          ]
        : teacherData.teachers.map((teacher) => [
              teacher.id || "-",
              teacher.name || "-",
              // Array.isArray(teacher.subject_teaching_names) && teacher.subject_teaching_names.length > 0
              // ? teacher.subject_teaching_names.join(", ")
              // : "-",
              Array.isArray(teacher.subject_teaching) &&
              teacher.subject_teaching.length > 0
                  ? teacher.subject_teaching.map((subject) => (
                        <div key={subject.lesson_id}>
                            {`${subject.subject_name} (${subject.study_level_name})`}
                        </div>
                    ))
                  : "Not assigned",
              teacher.email || "-",
              teacher.joining_date || "-",
              <div className="actions">
                  {/*Edit action*/}
                  <Link
                      to={`/teacher/edit/${teacher.id}`}
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
                      onClick={() => handleDelete(teacher.id)}
                      style={{ cursor: "pointer" }}
                  />
                  {/*Profile action*/}
                  <Link
                      to={`/teacher/${teacher.id}/profile`}
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
            <div className="page-title">Teachers</div>
            <div className="d-flex justify-content-end">
                <Link to="/teacher/create" className="text-decoration-none">
                    <Button>Add Teacher</Button>
                </Link>
            </div>
            <ContentContainer title="Teacher List">
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
