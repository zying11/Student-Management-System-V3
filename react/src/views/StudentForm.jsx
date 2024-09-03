import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import Form from 'react-bootstrap/Form';
import Button from "../components/Button/Button";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import StudentDetailsForm from "../components/Form/StudentDetailsForm";
import ParentDetailsForm from "../components/Form/ParentDetailsForm";
import EnrollmentDetailsForm from "../components/Form/EnrollmentDetailsForm";
import Spinner from 'react-bootstrap/Spinner';

export default function TeacherForm({ isEditing }) {
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

    const [enrollmentDetails, setEnrollmentDetails] = useState([{ lesson_id: '', study_level: '', class_time: '' }]);
    const [lessons, setLessons] = useState([]);

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // useEffect(async () => {


    //     if (isEditing && id) {
    //         const fetchStudentData = async () => {
    //             setLoading(true);
    //             try {
    //                 // Fetch student data using the ID
    //                 const response = await axiosClient.get(`/students/${id}`);

    //                 // Assume response.data is the student object
    //                 const studentData = response.data;

    //                 if (studentData) {
    //                     setStudentDetails({
    //                         name: studentData.name,
    //                         gender: studentData.gender,
    //                         birth_date: studentData.birth_date,
    //                         age: calculateAge(studentData.birth_date),
    //                         nationality: studentData.nationality,
    //                         address: studentData.address,
    //                         postal_code: studentData.postal_code,
    //                     });

    //                     // Set parent details from the student data
    //                     setParentDetails(studentData.parents.map(parent => ({
    //                         id: parent.id || "",
    //                         name: parent.name || "",
    //                         email: parent.email || "",
    //                         phone_number: parent.phone_number || "",
    //                         relationship: parent.relationship || "",
    //                     })));

    //                          // Fetch enrollment details
    //      const enrollmentResponse = await axiosClient.get(`/students/${id}/enrollments`);
    //      setEnrollmentDetails(enrollmentResponse.data);
    //                 } else {
    //                     console.error('Student not found');
    //                 }
    //                 const lessonsResponse = await axiosClient.get('/lessons');
    //                 setLessons(lessonsResponse.data);

    //             } catch (error) {
    //                 console.error('Error fetching student data:', error);
    //             } finally {
    //                 setLoading(false);
    //             }
    //         };

    //         fetchStudentData();
    //     }
    // }, [isEditing, id]);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await axiosClient.get('/lessons');
                setLessons(response.data.lessons);
            } catch (error) {
                console.error('Error fetching lessons:', error);
            }
        };

        fetchLessons();

        const fetchStudentData = async () => {
            setLoading(true);
            try {
                if (isEditing && id) {
                    const studentResponse = await axiosClient.get(`/students/${id}`);
                    const studentData = studentResponse.data;

                    setStudentDetails({
                        name: studentData.name,
                        gender: studentData.gender,
                        birth_date: studentData.birth_date,
                        age: calculateAge(studentData.birth_date),
                        nationality: studentData.nationality,
                        address: studentData.address,
                        postal_code: studentData.postal_code,
                    });

                    setParentDetails(studentData.parents.map(parent => ({
                        id: parent.id || "",
                        name: parent.name || "",
                        email: parent.email || "",
                        phone_number: parent.phone_number || "",
                        relationship: parent.relationship || "",
                    })));

                    const enrollmentResponse = await axiosClient.get(`/students/${id}/enrollments`);
                    setEnrollmentDetails(enrollmentResponse.data || []);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
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
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
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

    const handleParentDetailsChange = (e, index, field) => {
        const newParentDetails = [...parentDetails];
        newParentDetails[index][field] = e.target.value;
        setParentDetails(newParentDetails);

        console.log(`Updated parent ${index}:`, newParentDetails[index]);

        // Clear the specific error when the user starts typing
        const errorKey = field === 'phone_number' ? `parent_phone_${index}` : `parent_${field}_${index}`;
        if (errors[errorKey]) {
            setErrors({ ...errors, [errorKey]: "" });
        }
    };


    const handleAddParent = () => {
        setParentDetails([...parentDetails, { id: "", name: "", email: "", phone_number: "", relationship: "" }]);
    };

    const handleRemoveParent = (index) => {
        const newParentDetails = parentDetails.filter((_, i) => i !== index);
        setParentDetails(newParentDetails);
    };

    const handleLessonChange = (e, index, field) => {
        const newEnrollmentDetails = [...enrollmentDetails];
        newEnrollmentDetails[index][field] = e.target.value;
        setEnrollmentDetails(newEnrollmentDetails);
    };

    const addLesson = () => {
        setEnrollmentDetails([...enrollmentDetails, { lesson_id: '', study_level: '', class_time: '' }]);
    };

    const removeLesson = (index) => {
        const newEnrollmentDetails = enrollmentDetails.filter((_, i) => i !== index);
        setEnrollmentDetails(newEnrollmentDetails);
    };



    // // Function to handle form submission
    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     // Validate input fields
    //     const validationErrors = validate();
    //     if (Object.keys(validationErrors).length > 0) {
    //         setErrors(validationErrors);
    //         return;
    //     }

    //     // Set loading to true while saving data
    //     setLoading(true);
    //     try {
    //         // If editing, update the teacher details
    //         if (isEditing && id) {
    //             // Update the student details
    //             await axiosClient.put(`/students/${id}`, studentDetails);


    //             // Update each parent detail associated with the student
    //         await Promise.all(
    //             parentDetails.map(async parent => {

    //                 if (parent.id) {
    //                     console.log("parent.id", parent.id);
    //                     // Update existing parent details
    //                     return axiosClient.put(`/parents/${parent.id}`, parent);
    //                 } else {
    //                     // Create new parent, only if the email is unique
    //                     try {
    //                         await axiosClient.post(`/parents`, parent);
    //                     } catch (error) {
    //                         if (error.response && error.response.data.errors.email) {
    //                             // Email already exists, add to the error state
    //                             console.log("Email already exists");
    //                             setErrors({
    //                                 ...errors,
    //                                 [`parent_email_${parentDetails.indexOf(parent)}`]: "Email already exists",
    //                             });
    //                             throw new Error("Validation failed");
    //                         }
    //                     }
    //                 }
    //             })
    //         );



    //             // If creating a new teacher
    //         } else {
    //             // Create the student
    //             const studentResponse = await axiosClient.post(`/students`, studentDetails);
    //             const studentId = studentResponse.data.id;

    //             // Create parent details and associate with student
    //             const parentResponses = await Promise.all(
    //                 parentDetails.map(parent => axiosClient.post('/parents', parent))
    //             );

    //             const parentIds = parentResponses.map(response => response.data.id);
    //             await axiosClient.post(`/students/${studentId}/parents`, { parent_ids: parentIds, student_id: studentId });
    //         }

    //         alert(`Student ${isEditing ? 'updated' : 'created'} successfully`);

    //         // Redirect to the student list page
    //         navigate('/students');
    //     } catch (error) {
    //         if (error.response && error.response.data) {
    //             setErrors(error.response.data.errors);
    //         } else {
    //             alert('Error saving student: ' + error.message);
    //         }
    //     } finally {
    //         // Set loading to false after saving data
    //         setLoading(false);
    //     }
    // };

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
            let studentResponse;

            if (isEditing && id) {
                // Update existing student details
                studentResponse = await axiosClient.put(`/students/${id}`, studentDetails);

                // Create a map to store new parent IDs
                const newParentIds = new Map();

                // First, update existing parents and create new parents
                await Promise.all(
                    parentDetails.map(async (parent, index) => {
                        if (parent.id) {
                            // Update existing parent details
                            return axiosClient.put(`/parents/${parent.id}`, parent);
                        } else {
                            // Create new parent
                            try {
                                const response = await axiosClient.post(`/parents`, parent);
                                // Store the new parent ID and update state
                                newParentIds.set(index, response.data.id);
                                return response;
                            } catch (error) {
                                if (error.response && error.response.data.errors.email) {
                                    // Email already exists, add to the error state
                                    console.log("Email already exists");
                                    setErrors({
                                        ...errors,
                                        [`parent_email_${index}`]: "Email already exists",
                                    });
                                    throw new Error("Validation failed");
                                }
                            }
                        }
                    })
                );

                // Collect all parent IDs (existing + new)
                const allParentIds = parentDetails.map((parent, index) =>
                    newParentIds.get(index) || parent.id
                );

                // Sync student with parent records via pivot table
                await axiosClient.post(`/students/${id}/parents`, { parent_ids: allParentIds, student_id: studentId });

            } else {
                // Create new student
                studentResponse = await axiosClient.post(`/students`, studentDetails);
                const studentId = studentResponse.data.id;

                // Create parent details and associate with student
                const parentResponses = await Promise.all(
                    parentDetails.map(parent => axiosClient.post('/parents', parent))
                );

                const parentIds = parentResponses.map(response => response.data.id);

                // Link new parents to the student via the pivot table
                await axiosClient.post(`/students/${studentId}/parents`, { parent_ids: parentIds, student_id: studentId });

            }

            alert(`Student ${isEditing ? 'updated' : 'created'} successfully`);
            navigate('/students');
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data.errors);
            } else {
                alert('Error saving student: ' + error.message);
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
                errors[`parent_relationship_${index}`] = "Relationship is required";
            }
            if (!parent.email) {
                errors[`parent_email_${index}`] = "Email is required";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parent.email)) {
                errors[`parent_email_${index}`] = "Email is invalid";
            }
            if (!parent.phone_number) {
                errors[`parent_phone_${index}`] = "Phone number is required";
            } else if (!/^\d{10,15}$/.test(parent.phone_number)) {
                errors[`parent_phone_${index}`] = "Phone number must be between 10 to 15 digits";
            }
        });

        // // Validate subject teaching details
        // if (selectedSubjects.includes('')) {
        //     errors.subject_ids = "At least one subject must be selected, and no fields can be empty";
        // }

        return errors;
    };

    return (
        <>
            {/* <div className="page-title">{isEditing ? 'Edit Teacher' : 'Create Teacher'}</div> */}
            <div className="page-title">Students</div>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (

                <Form onSubmit={handleSubmit}>
                    <ContentContainer title="Student Details">
                        <StudentDetailsForm
                            studentDetails={studentDetails}
                            handleStudentDetailsChange={handleStudentDetailsChange}
                            errors={errors}
                        />
                    </ContentContainer>

                    <ContentContainer title="Parent Details">
                        <ParentDetailsForm
                            parentDetails={parentDetails}
                            handleParentDetailsChange={handleParentDetailsChange}
                            addParent={handleAddParent}
                            removeParent={handleRemoveParent}
                            errors={errors}
                        />
                    </ContentContainer>

                    <ContentContainer title="Subject Enrollment Details">
                        <EnrollmentDetailsForm
                            enrollmentDetails={enrollmentDetails}
                            lessons={lessons}
                            handleChange={handleLessonChange}
                            handleAddLesson={addLesson}
                            handleRemoveLesson={removeLesson}
                            errors={errors}
                        />
                    </ContentContainer>

                    <div className="d-flex justify-content-end mt-4 mb-4">
                        <Button
                            className="btn-create-yellow"
                            type="submit"
                            variant="primary"
                        >
                            {isEditing ? 'Save' : 'Create'}
                        </Button>
                    </div>
                </Form>
            )}
        </>
    );
}
