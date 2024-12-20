import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import Form from "react-bootstrap/Form";
import Button from "../components/Button/Button";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import StudentDetailsForm from "../components/Form/StudentDetailsForm";
import ParentDetailsForm from "../components/Form/ParentDetailsForm";
import EnrollmentDetailsForm from "../components/Form/EnrollmentDetailsForm";
import Spinner from "react-bootstrap/Spinner";

export default function StudentForm({ isEditing }) {
    // Get the ID from the route parameters
    const { id } = useParams();

    // Use the navigate hook to redirect to another page
    const navigate = useNavigate();

    const [studentDetails, setStudentDetails] = useState({
        name: "",
        gender: "",
        age: "",
        birth_date: "",
        nationality: "",
        address: "",
        postal_code: "",
    });

    const [parentDetails, setParentDetails] = useState([
        {
            id: "",
            name: "",
            email: "",
            phone_number: "",
            relationship: "",
        },
    ]);

    const [enrollmentDetails, setEnrollmentDetails] = useState([
        {
            id: "",
            subject_id: "",
            study_level_id: "",
            lesson_id: "",
        },
    ]);
    const [enrollmentsToDelete, setEnrollmentsToDelete] = useState([]);

    const [subjects, setSubjects] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [rooms, setRooms] = useState([]);

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const [enrollmentsData, setEnrollmentsData] = useState([]);

    useEffect(() => {
        // Fetch enrollments data
        const fetchEnrollments = async () => {
            const enrollmentsResponse = await axiosClient.get("/enrollments");
            const enrollmentsData = enrollmentsResponse.data;
            setEnrollmentsData(enrollmentsData);
        };
        fetchEnrollments();
    }, []);

    useEffect(() => {
        // Fetch subjects, lessons and rooms to populate the dropdowns
        const fetchSubjectsAndLessons = async () => {
            const subjectsResponse = await axiosClient.get("/subjects");
            const subjectsData = subjectsResponse.data;

            const lessonsResponse = await axiosClient.get("/lessons");
            const lessonsData = lessonsResponse.data;

            const roomsResponse = await axiosClient.get("/rooms");
            const roomsData = roomsResponse.data;

            setSubjects(subjectsData);
            setLessons(lessonsData);
            setRooms(roomsData);
        };
        fetchSubjectsAndLessons();

        // Fetch student data if editing
        const fetchStudentData = async () => {
            setLoading(true);
            try {
                if (isEditing && id) {
                    // Fetch student details
                    const studentResponse = await axiosClient.get(
                        `/students/${id}`
                    );
                    const studentData = studentResponse.data;

                    // Set student details
                    setStudentDetails({
                        name: studentData.name,
                        gender: studentData.gender,
                        birth_date: studentData.birth_date,
                        age: calculateAge(studentData.birth_date),
                        nationality: studentData.nationality,
                        address: studentData.address,
                        postal_code: studentData.postal_code,
                    });

                    // Set parent details
                    setParentDetails(
                        studentData.parents.map((parent) => ({
                            id: parent.id || "",
                            name: parent.name || "",
                            email: parent.email || "",
                            phone_number: parent.phone_number || "",
                            relationship: parent.relationship || "",
                        }))
                    );

                    // Set enrollment details
                    setEnrollmentDetails(
                        studentData.enrollments.map((enrollment) => ({
                            id: enrollment.id,
                            subject_id: enrollment.subject
                                ? enrollment.subject.id
                                : "",
                            study_level_id: enrollment.study_level
                                ? enrollment.study_level.id
                                : "",
                            lesson_id: enrollment.lesson
                                ? enrollment.lesson.id
                                : "",
                        }))
                    );
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [isEditing, id]);

    // Function to calculate age from birth date
    const calculateAge = (birthDate) => {
        // Get today's date
        const today = new Date();

        // Get the birth date
        const birth = new Date(birthDate);

        // Calculate the age
        let age = today.getFullYear() - birth.getFullYear();

        // // Get the difference in months
        const monthDiff = today.getMonth() - birth.getMonth();

        // If the birth month is greater than the current month
        // or if the birth month is the same as the current month
        // but the birth date is greater than the current date
        // then subtract 1 from the age
        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birth.getDate())
        ) {
            age--;
        }
        return age;
    };

    // Function to handle changes in the student details
    const handleStudentDetailsChange = (e) => {
        // Get the name and value from the input field
        const { name, value } = e.target;

        // Set the student details
        // Calculate the age if the birth_date is changed
        // and set the age in the student details
        // Otherwise, set the student details as usual
        if (name === "birth_date") {
            const age = calculateAge(value);
            setStudentDetails({ ...studentDetails, [name]: value, age: age });
        } else {
            setStudentDetails({ ...studentDetails, [name]: value });
        }

        // Clear the specific error when the user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    // Function to handle changes in the parent details
    const handleParentDetailsChange = (e, index, field) => {
        const newParentDetails = [...parentDetails];
        newParentDetails[index][field] = e.target.value;
        setParentDetails(newParentDetails);

        console.log(`Updated parent ${index}:`, newParentDetails[index]);

        // Clear the specific error when the user starts typing
        const errorKey =
            field === "phone_number"
                ? `parent_phone_${index}`
                : `parent_${field}_${index}`;
        if (errors[errorKey]) {
            setErrors({ ...errors, [errorKey]: "" });
        }
    };

    // Function to add a new parent
    const handleAddParent = () => {
        setParentDetails([
            ...parentDetails,
            { id: "", name: "", email: "", phone_number: "", relationship: "" },
        ]);
    };

    // Function to remove a parent
    const handleRemoveParent = (index) => {
        const newParentDetails = parentDetails.filter((_, i) => i !== index);
        setParentDetails(newParentDetails);
    };

    // Function to handle changes in the enrollment details
    const handleEnrollmentChange = (e, index, field) => {
        // Update the relevant enrollment detail
        const updatedEnrollmentDetails = [...enrollmentDetails];
        updatedEnrollmentDetails[index][field] = e.target.value;

        setEnrollmentDetails(updatedEnrollmentDetails);

        // Clear specific error when the value changes
        if (field === "subject_id") {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [`enrollment_subject_id_${index}`]: "",
            }));
        } else if (field === "study_level_id") {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [`enrollment_study_level_id_${index}`]: "",
            }));
        } else if (field === "lesson_id") {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [`enrollment_lesson_id_${index}`]: "",
            }));
        }
    };

    // Add a new enrollment
    const addLesson = () => {
        setEnrollmentDetails([
            ...enrollmentDetails,
            { id: "", subject_id: "", study_level_id: "", lesson_id: "" },
        ]);
    };

    // Remove an enrollment
    const removeLesson = (index) => {
        // Get the enrollment to remove
        const enrollmentToRemove = enrollmentDetails[index];

        // Add the enrollment ID to the list of enrollments to delete
        if (enrollmentToRemove.id) {
            setEnrollmentsToDelete([
                ...enrollmentsToDelete,
                enrollmentToRemove.id,
            ]);
        }

        // Remove from the state
        // by filtering out the enrollment at the specified index
        const newEnrollmentDetails = enrollmentDetails.filter(
            (_, i) => i !== index
        );
        setEnrollmentDetails(newEnrollmentDetails);
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate input fields
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            // Fetch all parents once before processing
            const existingParentsResponse = await axiosClient.get("/parents");
            const existingParents = existingParentsResponse.data.data;

            let studentResponse;

            if (isEditing && id) {
                // Get existing student details to find associated parent IDs
                studentResponse = await axiosClient.get(`/students/${id}`);
                const existingParentIds = studentResponse.data.parents.map(
                    (parent) => parent.id
                );

                // Update existing student details
                studentResponse = await axiosClient.put(
                    `/students/${id}`,
                    studentDetails
                );
                const studentId = studentResponse.data.id;

                // Handle parent updates or creation
                const newParentIds = new Map();

                await Promise.all(
                    parentDetails.map(async (parent, index) => {
                        if (parent.id) {
                            // Update existing parent details
                            return axiosClient.put(
                                `/parents/${parent.id}`,
                                parent
                            );
                        } else {
                            // Check if the parent exists by email in the fetched data
                            const existingParent = existingParents.find(
                                (p) => p.email === parent.email
                            );
                            if (existingParent) {
                                // Check if the parent is already associated with the student
                                if (
                                    existingParentIds.includes(
                                        existingParent.id
                                    )
                                ) {
                                    setErrors({
                                        parent_email: `Parent with email ${parent.email} is already associated with this student.`,
                                    });
                                    throw new Error(
                                        "Duplicate parent association found"
                                    );
                                } else {
                                    newParentIds.set(index, existingParent.id);
                                }
                            } else {
                                // Check for duplicate emails in parent details
                                const parentEmails = parentDetails.map(
                                    (parent) => parent.email
                                );
                                const duplicateEmails = parentEmails.filter(
                                    (email, index) =>
                                        parentEmails.indexOf(email) !== index
                                );

                                if (duplicateEmails.length > 0) {
                                    setErrors({
                                        parent_email: `Duplicate emails found: ${duplicateEmails.join(
                                            ", "
                                        )}`,
                                    });
                                    alert("Duplicate emails found");
                                    return; // Stop execution if there are duplicates
                                }
                                // Create new parent if no existing parent was found
                                const response = await axiosClient.post(
                                    `/parents`,
                                    parent
                                );
                                newParentIds.set(index, response.data.id);
                            }
                        }
                    })
                );

                // Collect all parent IDs (existing + new)
                const allParentIds = parentDetails.map(
                    (parent, index) => newParentIds.get(index) || parent.id
                );
                // Sync student with parent records via pivot table
                await axiosClient.post(`/students/${id}/parents`, {
                    parent_ids: allParentIds,
                    student_id: studentId,
                });

                // Handle enrollment updates or creation
                const existingEnrollmentIds =
                    studentResponse.data.enrollments.map(
                        (enrollment) => enrollment.id
                    );
                await Promise.all(
                    enrollmentDetails.map(async (enrollment, index) => {
                        // Check if the enrollment is an existing enrollment
                        if (existingEnrollmentIds[index]) {
                            // Update existing enrollment
                            return axiosClient.put(
                                `/enrollments/${existingEnrollmentIds[index]}`,
                                {
                                    student_id: id,
                                    subject_id: enrollment.subject_id,
                                    study_level_id: enrollment.study_level_id,
                                    lesson_id: enrollment.lesson_id,
                                }
                            );
                        } else {
                            // Create new enrollment
                            return axiosClient.post(`/enrollments`, {
                                student_id: id,
                                subject_id: enrollment.subject_id,
                                study_level_id: enrollment.study_level_id,
                                lesson_id: enrollment.lesson_id,
                            });
                        }
                    })
                );

                // Handle enrollment deletions
                if (enrollmentsToDelete.length > 0) {
                    await Promise.all(
                        enrollmentsToDelete.map((id) =>
                            axiosClient.delete(`/enrollments/${id}`)
                        )
                    );
                }
            } else {
                // Create new student
                studentResponse = await axiosClient.post(
                    `/students`,
                    studentDetails
                );
                const studentId = studentResponse.data.id;

                // Check for duplicate emails in parent details
                const parentEmails = parentDetails.map(
                    (parent) => parent.email
                );
                const duplicateEmails = parentEmails.filter(
                    (email, index) => parentEmails.indexOf(email) !== index
                );

                if (duplicateEmails.length > 0) {
                    // Redirect to edit page for parent details
                    navigate(`/student/edit/${studentId}`);
                    setErrors({
                        parent_email: `Duplicate emails found: ${duplicateEmails.join(
                            ", "
                        )}`,
                    });
                    alert("Duplicate emails found");
                    return; // Stop execution if there are duplicates
                }

                // Create new parents if they do not exist
                // Reuse existing parents if they exist
                // Associate parents with the student
                const parentIds = await Promise.all(
                    parentDetails.map(async (parent) => {
                        const existingParent = existingParents.find(
                            (p) => p.email === parent.email
                        );
                        if (existingParent) {
                            return existingParent.id; // Use existing parent ID
                        }
                        const response = await axiosClient.post(
                            `/parents`,
                            parent
                        );
                        return response.data.id; // Use new parent ID
                    })
                );

                // Link new parents to the student via the pivot table
                await axiosClient.post(`/students/${studentId}/parents`, {
                    parent_ids: parentIds,
                    student_id: studentId,
                });

                // Create enrollments
                await Promise.all(
                    enrollmentDetails.map((enrollment) =>
                        axiosClient.post(`/enrollments`, {
                            student_id: studentId,
                            ...enrollment,
                        })
                    )
                );
            }

            alert(`Student ${isEditing ? "updated" : "created"} successfully`);
            navigate("/students");
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data.errors);
            } else {
                alert("Error saving student: " + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // Function to validate input fields
    const validate = () => {
        const errors = {};

        // Validate student details
        if (!studentDetails.name) {
            errors.name = "Name is required";
        }

        if (!studentDetails.gender) {
            errors.gender = "Gender is required";
        }

        if (!studentDetails.birth_date) {
            errors.birth_date = "Birth date is required";
        }

        if (!studentDetails.nationality) {
            errors.nationality = "Nationality is required";
        }

        if (!studentDetails.address) {
            errors.address = "Address is required";
        }

        if (!studentDetails.postal_code) {
            errors.postal_code = "Postal code is required";
        } else if (!/^\d{5,6}$/.test(studentDetails.postal_code)) {
            errors.postal_code = "Postal code must be 5 or 6 digits";
        }

        // Validate parent details
        parentDetails.forEach((parent, index) => {
            if (!parent.name) {
                errors[`parent_name_${index}`] = "Name is required";
            }

            if (!parent.relationship) {
                errors[`parent_relationship_${index}`] =
                    "Relationship is required";
            }

            if (!parent.email) {
                errors[`parent_email_${index}`] = "Email is required";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parent.email)) {
                errors[`parent_email_${index}`] = "Email is invalid";
            }

            if (!parent.phone_number) {
                errors[`parent_phone_${index}`] = "Phone number is required";
            } else if (!/^\d{10,15}$/.test(parent.phone_number)) {
                errors[`parent_phone_${index}`] =
                    "Phone number must be between 10 to 15 digits";
            }
        });

        // Validate enrollment details
        enrollmentDetails.forEach((enrollment, index) => {
            if (!enrollment.subject_id) {
                errors[`enrollment_subject_id_${index}`] =
                    "Subject is required";
            }

            if (!enrollment.study_level_id) {
                errors[`enrollment_study_level_id_${index}`] =
                    "Study level is required";
            }

            if (!enrollment.lesson_id) {
                errors[`enrollment_lesson_id_${index}`] =
                    "Class time is required";
            }
        });

        return errors;
    };

    return (
        <>
            {/* <div className="page-title">{isEditing ? 'Edit Teacher' : 'Create Teacher'}</div> */}
            <div className="page-title">Students</div>
            {loading ? (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "400px" }}
                >
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Form onSubmit={handleSubmit}>
                    <ContentContainer title="Student Details">
                        <StudentDetailsForm
                            studentDetails={studentDetails}
                            handleStudentDetailsChange={
                                handleStudentDetailsChange
                            }
                            errors={errors}
                        />
                    </ContentContainer>

                    <ContentContainer title="Parent Details">
                        <ParentDetailsForm
                            parentDetails={parentDetails}
                            handleParentDetailsChange={
                                handleParentDetailsChange
                            }
                            addParent={handleAddParent}
                            removeParent={handleRemoveParent}
                            errors={errors}
                        />
                    </ContentContainer>

                    <ContentContainer title="Enrollment Details">
                        <EnrollmentDetailsForm
                            enrollmentDetails={enrollmentDetails}
                            handleEnrollmentChange={handleEnrollmentChange}
                            addLesson={addLesson}
                            removeLesson={removeLesson}
                            errors={errors}
                            subjects={subjects}
                            lessons={lessons}
                            rooms={rooms}
                            existingEnrollments={enrollmentsData}
                        />
                    </ContentContainer>

                    <div className="d-flex justify-content-end mt-4 mb-4">
                        <Button
                            className="btn-create-yellow"
                            type="submit"
                            variant="primary"
                        >
                            {isEditing ? "Save" : "Create"}
                        </Button>
                    </div>
                </Form>
            )}
        </>
    );
}
