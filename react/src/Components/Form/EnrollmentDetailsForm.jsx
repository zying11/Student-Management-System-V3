import React, { useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";

export default function EnrollmentDetailsForm({
    enrollmentDetails,
    handleEnrollmentChange,
    addLesson,
    removeLesson,
    errors,
    subjects,
    lessons,
    rooms,
    existingEnrollments,
}) {
    // Ensure there's at least one enrollment detail field on initial render
    useEffect(() => {
        // If there are no enrollment details, add one
        if (enrollmentDetails.length === 0) {
            addLesson();
        }
    }, [enrollmentDetails, addLesson]);

    // Extract subjects, lessons and rooms from props
    const subjectsArray = subjects?.subjects || [];
    const lessonsArray = lessons?.lessons || [];
    const roomsArray = rooms?.rooms || [];

    // Days of the week
    const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    // Get unique subjects by grouping them
    const getUniqueSubjects = () => {
        const uniqueSubjects = new Set();
        return subjectsArray
            .filter((subject) => {
                if (!uniqueSubjects.has(subject.subject_name)) {
                    uniqueSubjects.add(subject.subject_name);
                    return true;
                }
                return false;
            })
            .map((subject) => ({
                subject_name: subject.subject_name,
            }));
    };

    // Get all study levels for a subject name (not ID)
    const getStudyLevelsForSubject = (subjectName) => {
        return subjectsArray
            .filter((subject) => subject.subject_name === subjectName)
            .map((subject) => ({
                id: subject.level_id,
                level_name: subject.level_name,
                subject_id: subject.id, // Keep the original subject ID
            }));
    };

    // Get the room name based on the room ID
    const getRoomName = (roomId) => {
        const room = roomsArray.find((room) => room.id === roomId);
        return room ? room.room_name : "Unknown Room";
    };

    // To count current enrollments per lesson
    const getLessonEnrollmentCount = (lessonId) => {
        return (existingEnrollments?.data || []).filter(
            (enrollment) => enrollment.lesson.id === lessonId
        ).length;
    };

    // To include room capacity check
    const getRoomCapacity = (roomId) => {
        const room = roomsArray.find((room) => room.id === roomId);
        return room ? room.capacity : 0;
    };

    // To check if a lesson is full
    const isLessonFull = (lesson) => {
        const currentEnrollments = getLessonEnrollmentCount(lesson.id);
        const roomCapacity = getRoomCapacity(lesson.room_id);
        return currentEnrollments >= roomCapacity;
    };

    // Function to check if there's a clash with existing lessons, excluding the current lesson
    const checkForClashes = (lesson, currentIndex) => {
        // Check if the lesson clashes with any other lesson
        return enrollmentDetails.some((enrollment, index) => {
            // Skip the current enrollment being checked
            if (index === currentIndex) return false;

            // Find the lesson based on the lesson ID
            const selectedLesson = lessonsArray.find(
                (l) => l.id === parseInt(enrollment.lesson_id, 10)
            );

            // If there's no selected lesson, no clash
            if (!selectedLesson) return false;

            // Check if day is the same and the times overlap
            // If the start time of the new lesson is between the start and end time of the selected lesson
            // Or if the end time of the new lesson is between the start and end time of the selected lesson
            // Or if the new lesson starts before the selected lesson and ends after the selected lesson
            // Then there's a clash
            // Otherwise, no clash
            // Return true if there's a clash
            // Return false if there's no clash
            // If there's a clash, the lesson is disabled
            // If there's no clash, the lesson is enabled
            return (
                selectedLesson.day === lesson.day &&
                ((lesson.start_time >= selectedLesson.start_time &&
                    lesson.start_time < selectedLesson.end_time) ||
                    (lesson.end_time > selectedLesson.start_time &&
                        lesson.end_time <= selectedLesson.end_time))
            );
        });
    };

    // Handle enrollment change function
    const handleEnrollmentChangeWrapper = (e, index, field) => {
        // Get the selected value
        const selectedValue = e.target.value;

        // If the field is the subject field
        // Update the subject ID
        // Reset the study level and lesson
        // Clear the errors for the study level and lesson fields
        // Set the error for the subject to an empty string or null
        // Otherwise, update the field
        if (field === "subject_id") {
            // When selecting a subject, mean selecting the subject name
            const selectedSubjectName = selectedValue;

            // Get the first available subject ID for this subject name
            const firstSubject = subjectsArray.find(
                (subject) => subject.subject_name === selectedSubjectName
            );

            if (firstSubject) {
                // Update with the first available subject ID
                handleEnrollmentChange(
                    { target: { value: firstSubject.id } },
                    index,
                    "subject_id"
                );
            }

            // Reset study level and lesson
            handleEnrollmentChange(
                { target: { value: "" } },
                index,
                "study_level_id"
            );
            handleEnrollmentChange(
                { target: { value: "" } },
                index,
                "lesson_id"
            );
        } else if (field === "study_level_id") {
            const selectedLevelId = parseInt(selectedValue, 10);

            // Get current subject name from the current subject ID
            const currentSubject = subjectsArray.find(
                (sub) => sub.id === enrollmentDetails[index].subject_id
            );

            if (currentSubject) {
                // Find the subject entry that matches both subject name and selected level
                const newSubject = subjectsArray.find(
                    (sub) =>
                        sub.subject_name === currentSubject.subject_name &&
                        sub.level_id === selectedLevelId
                );

                if (newSubject) {
                    // Update the study level
                    handleEnrollmentChange(e, index, field);

                    // Update the subject ID to match the new level
                    handleEnrollmentChange(
                        { target: { value: newSubject.id } },
                        index,
                        "subject_id"
                    );

                    // Reset lesson
                    handleEnrollmentChange(
                        { target: { value: "" } },
                        index,
                        "lesson_id"
                    );
                }
            }
        } else {
            handleEnrollmentChange(e, index, field);
        }
    };

    // Get available subjects for each enrollment detail
    const getAvailableSubjects = (index) => {
        // Get selected subject names from other rows
        const selectedSubjectNames = enrollmentDetails
            .map((enrollment, i) => {
                if (i !== index && enrollment.subject_id) {
                    const subject = subjectsArray.find(
                        (sub) => sub.id === enrollment.subject_id
                    );
                    return subject?.subject_name;
                }
                return null;
            })
            .filter((name) => name !== null);

        // Get current subject name
        const currentSubject = enrollmentDetails[index].subject_id
            ? subjectsArray.find(
                  (sub) => sub.id === enrollmentDetails[index].subject_id
              )
            : null;

        return getUniqueSubjects()
            .filter((subject) => {
                // Include the current subject
                if (
                    currentSubject &&
                    currentSubject.subject_name === subject.subject_name
                ) {
                    return true;
                }
                // Filter out subjects selected in other rows
                return !selectedSubjectNames.includes(subject.subject_name);
            })
            .map((subject) => (
                <option key={subject.subject_name} value={subject.subject_name}>
                    {subject.subject_name}
                </option>
            ));
    };

    // Get the lessons for the selected subject
    const getLessonsForSubject = (subjectId) => {
        return lessonsArray.filter((lesson) => lesson.subject_id === subjectId);
    };

    // Get available lessons for the selected subject
    // Disable lessons that clash with existing lessons
    // If there are available lessons, return the lessons
    // Otherwise, return a message that there are no lessons available
    // To include capacity information
    const availableLessons = (subjectId, currentIndex) => {
        return getLessonsForSubject(subjectId).map((lesson) => {
            const isClashing = checkForClashes(lesson, currentIndex);
            const currentEnrollments = getLessonEnrollmentCount(lesson.id);
            const roomCapacity = getRoomCapacity(lesson.room_id);
            const isFull = currentEnrollments >= roomCapacity;

            return (
                <option
                    key={lesson.id}
                    value={lesson.id}
                    disabled={isClashing || isFull}
                >
                    {lesson.start_time} - {lesson.end_time} (
                    {daysOfWeek[lesson.day]}, {getRoomName(lesson.room_id)}) -
                    {isFull
                        ? " Full"
                        : ` ${currentEnrollments}/${roomCapacity} spots filled`}
                    {isClashing && " - Time Clash"}
                </option>
            );
        });
    };

    return (
        <>
            <Form.Group controlId="enrollments">
                {enrollmentDetails.map((enrollment, index) => (
                    <React.Fragment key={index}>
                        <Row>
                            <Col className="mt-3" md={6} sm={12}>
                                {/* Subject Field */}
                                <Form.Group
                                    as={Col}
                                    controlId={`formSubject-${index}`}
                                >
                                    <Form.Label>Subject</Form.Label>
                                    <Form.Select
                                        name="subject_id"
                                        value={
                                            subjectsArray.find(
                                                (sub) =>
                                                    sub.id ===
                                                    enrollment.subject_id
                                            )?.subject_name || ""
                                        }
                                        onChange={(e) =>
                                            handleEnrollmentChangeWrapper(
                                                e,
                                                index,
                                                "subject_id"
                                            )
                                        }
                                        isInvalid={
                                            !!errors[
                                                `enrollment_subject_id_${index}`
                                            ]
                                        }
                                    >
                                        <option value="">Select Subject</option>
                                        {getAvailableSubjects(index)}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {
                                            errors[
                                                `enrollment_subject_id_${index}`
                                            ]
                                        }
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col className="mt-3" md={6} sm={12}>
                                {/* Study Level Field */}
                                <Form.Group
                                    as={Col}
                                    controlId={`formStudyLevel-${index}`}
                                >
                                    <Form.Label>Study Level</Form.Label>
                                    <Form.Select
                                        name="study_level_id"
                                        value={enrollment.study_level_id}
                                        onChange={(e) =>
                                            handleEnrollmentChangeWrapper(
                                                e,
                                                index,
                                                "study_level_id"
                                            )
                                        }
                                        isInvalid={
                                            !!errors[
                                                `enrollment_study_level_id_${index}`
                                            ]
                                        }
                                    >
                                        <option value="">
                                            Select Study Level
                                        </option>
                                        {enrollment.subject_id &&
                                            getStudyLevelsForSubject(
                                                subjectsArray.find(
                                                    (sub) =>
                                                        sub.id ===
                                                        enrollment.subject_id
                                                )?.subject_name
                                            ).map((level) => (
                                                <option
                                                    key={level.id}
                                                    value={level.id}
                                                >
                                                    {level.level_name}
                                                </option>
                                            ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {
                                            errors[
                                                `enrollment_study_level_id_${index}`
                                            ]
                                        }
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col className="mt-3" md={6} sm={12}>
                                {/* Class Time Field */}
                                <Form.Group
                                    controlId={`formClassTime-${index}`}
                                >
                                    <Form.Label>Class Time</Form.Label>
                                    <Form.Select
                                        name="lesson_id"
                                        value={enrollment.lesson_id}
                                        onChange={(e) =>
                                            handleEnrollmentChangeWrapper(
                                                e,
                                                index,
                                                "lesson_id"
                                            )
                                        }
                                        isInvalid={
                                            !!errors[
                                                `enrollment_lesson_id_${index}`
                                            ]
                                        }
                                    >
                                        <option value="">
                                            Select Class Time
                                        </option>
                                        {enrollment.subject_id &&
                                            availableLessons(
                                                enrollment.subject_id,
                                                index
                                            )}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {
                                            errors[
                                                `enrollment_lesson_id_${index}`
                                            ]
                                        }
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mt-3">
                            <Col className="d-flex justify-content-end">
                                <img
                                    className="ms-2"
                                    src="http://localhost:8000/icon/add.png"
                                    alt="Add"
                                    onClick={addLesson}
                                    style={{ cursor: "pointer" }}
                                />
                                <img
                                    className="ms-2"
                                    src="http://localhost:8000/icon/delete.png"
                                    alt="Delete"
                                    onClick={() => removeLesson(index)}
                                    style={{ cursor: "pointer" }}
                                />
                            </Col>
                        </Row>
                    </React.Fragment>
                ))}
            </Form.Group>
        </>
    );
}
