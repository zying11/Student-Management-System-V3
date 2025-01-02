import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axiosClient";
import Button from "../components/Button/Button";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import { Table } from "../components/Table/Table";
import SearchBar from "../components/SearchBar";
import { useStateContext } from "../contexts/ContextProvider";
import "../css/Teacher.css";

export default function Teacher() {
    // Access the logged-in user with their role
    const { user } = useStateContext();

    const [teacherData, setTeacherData] = useState({
        teachers: [],
        loading: true,
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState("");

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        // Check initial screen size
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Fetch teacher data
    useEffect(() => {
        async function fetchTeachers() {
            try {
                let response;

                if (user.role_id === 1) {
                    // Admin role, fetch all teachers
                    response = await axiosClient.get("/teachers");
                    setTeacherData({
                        teachers: response.data.data,
                        loading: false,
                    });
                } else if (user.role_id === 2) {
                    // Teacher, fetch only their own details
                    response = await axiosClient.get(
                        `/teacher-details/users/${user.id}`
                    );
                    setTeacherData({
                        teachers: [response.data], // Wrap single teacher in an array for consistency
                        loading: false,
                    });
                } else {
                    throw new Error("Unauthorized role");
                }
            } catch (error) {
                console.error("Error fetching teacher data:", error);
                setTeacherData({
                    teachers: [],
                    loading: false,
                });
                setError(
                    "Error fetching teacher data. Please try again later."
                );
            }
        }

        fetchTeachers();
    }, [user]);

    // Handle deletion of a teacher (admin only)
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

    // Filter teachers by search query (admin only)
    const filteredTeachers =
        user.role_id === 1
            ? teacherData.teachers.filter((teacher) =>
                  teacher.name
                      ?.toLowerCase()
                      .includes(searchQuery.toLowerCase())
              )
            : // If user is a teacher, show only their own details
              teacherData.teachers;

    const tableHeader = [
        "ID",
        "Teacher Name",
        "Subject Teaching",
        "Email",
        "Joining Date",
        "Actions",
    ].filter(Boolean); // Remove null entries

    const tableData = teacherData.loading
        ? [
              [
                  <td
                      key="loading"
                      colSpan={tableHeader.length}
                      className="text-center"
                  >
                      Loading...
                  </td>,
              ],
          ]
        : filteredTeachers.map((teacher) => [
              teacher.id || "-",
              teacher.name || "-",
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

              // Actions column with conditional rendering based on user role
              <div className="actions d-flex">
                  {user.role_id === 1 && ( // Admin can Edit, Delete, Profile actions
                      <>
                          {/* Edit action */}
                          <Link
                              to={`/teacher/edit/${teacher.id}`}
                              className="text-decoration-none items"
                          >
                              <img
                                  className="me-2"
                                  src="/icon/edit.png"
                                  alt="Edit"
                              />
                          </Link>
                          {/* Delete action */}
                          <img
                              className="me-2 items"
                              src="/icon/delete.png"
                              alt="Delete"
                              onClick={() => handleDelete(teacher.id)}
                              style={{ cursor: "pointer" }}
                          />
                      </>
                  )}

                  {user.role_id === 2 && ( // Teacher can Edit, Profile actions only
                      <>
                          {/* Edit action */}
                          <Link
                              to={`/teacher/edit/${teacher.id}`}
                              className="text-decoration-none items"
                          >
                              <img
                                  className="me-2"
                                  src="/icon/edit.png"
                                  alt="Edit"
                              />
                          </Link>
                          {/* Placeholder for Delete action */}
                          <div style={{ width: "2px" }}></div>
                      </>
                  )}

                  {/* Profile action */}
                  <Link
                      to={`/teacher/${teacher.id}/profile`}
                      className="text-decoration-none items"
                  >
                      <img
                          className="me-2"
                          src="/icon/profile.png"
                          alt="Profile"
                      />
                  </Link>
              </div>,
          ]);

    return (
        <>
            <div className="page-title">Teachers</div>

            {user.role_id === 1 && ( // Only show Add Teacher button for admin
                <div className="d-flex justify-content-end">
                    <Link to="/teacher/create" className="text-decoration-none">
                        <Button>Add Teacher</Button>
                    </Link>
                </div>
            )}

            <ContentContainer title="Teacher List">
                {/* Search bar visible only for admin */}
                {user.role_id === 1 && (
                    <SearchBar
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        placeholder={
                            isMobile ? "Search name" : "Search teacher by name"
                        }
                    />
                )}

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
