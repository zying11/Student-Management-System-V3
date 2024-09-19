import React, { useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';

export default function EnrollmentDetailsForm({ enrollmentDetails, handleEnrollmentChange, addLesson, removeLesson, errors, subjects, lessons }) {
    // Ensure there's at least one enrollment detail field on initial render
    useEffect(() => {
        // If there are no enrollment details, add one
        if (enrollmentDetails.length === 0) {
            addLesson();
        }
    }, [enrollmentDetails, addLesson]);

    // Extract subjects and lessons from props
    const subjectsArray = (subjects?.subjects || []);
    const lessonsArray = (lessons?.lessons || []);

    // Get the study levels available for the selected subject
    const getStudyLevelsForSubject = (subjectId) => {
        // Find the subject based on the subjectId
        const subject = subjectsArray.find(subject => subject.id === subjectId);
        // If subject is not found, return an empty array
        if (!subject) return [];
        // Otherwise, return the study levels for the subject
        return subjectsArray.filter(sub => sub.id === subjectId)
            .map(sub => ({
                id: sub.level_id,
                level_name: sub.level_name
            }));
    };

    // Get the lessons for the selected subject
    const getLessonsForSubject = (subjectId) => {
        return lessonsArray.filter(lesson => lesson.subject_id === subjectId);
    };

    // Updated subject change handler to use new handleEnrollmentChange
    const handleSubjectChange = (e, index) => {
        // Get the selected subject id
        const selectedSubjectId = parseInt(e.target.value, 10);

        // Reset study level and lesson when the subject changes
        const updatedEnrollmentDetails = {
            ...enrollmentDetails[index],
            subject_id: selectedSubjectId,
            study_level_id: '', // Reset study level
            lesson_id: '', // Reset lesson
        };

        // Update the state using handleEnrollmentChange
        handleEnrollmentChange(
            { target: { value: selectedSubjectId } },
            index,
            'subject_id'
        );
        handleEnrollmentChange(
            { target: { value: updatedEnrollmentDetails.study_level_id } },
            index,
            'study_level_id'
        );
        handleEnrollmentChange(
            { target: { value: updatedEnrollmentDetails.lesson_id } },
            index,
            'lesson_id'
        );
    };

    const handleLessonChange = (e, index) => {
        // Get the selected lesson id
        handleEnrollmentChange(e, index, 'lesson_id');
    };

    // Get the available subjects for the select field
    const availableSubjects = subjectsArray.map(subject => (
        <option key={subject.id} value={subject.id}>
            {subject.subject_name}
        </option>
    ));

    // Get the study levels available for the selected subject
    const availableStudyLevels = (subjectId) => getStudyLevelsForSubject(subjectId).map(level => (
        <option key={level.id} value={level.id}>
            {level.level_name}
        </option>
    ));

    // Get the lessons available for the selected subject
    const availableLessons = (subjectId) => getLessonsForSubject(subjectId).map(lesson => (
        <option key={lesson.id} value={lesson.id}>
            {lesson.start_time} - {lesson.end_time} ({lesson.subject_name}, {lesson.level_name})
        </option>
    ));

    return (
        <>
            <Form.Group controlId="enrollments">
                {enrollmentDetails.map((enrollment, index) => (
                    <React.Fragment key={index}>
                        <Row className="mb-3">
                            {/* Subject Field */}
                            <Form.Group as={Col} controlId={`formSubject-${index}`}>
                                <Form.Label>Subject</Form.Label>
                                <Form.Select
                                    name="subject_id"
                                    value={enrollment.subject_id}
                                    onChange={(e) => handleSubjectChange(e, index)}
                                    isInvalid={!!errors[`enrollment_subject_id_${index}`]}
                                >
                                    <option value="">Select Subject</option>
                                    {availableSubjects.length > 0 ? availableSubjects : (
                                        <option value="">No subjects available</option>
                                    )}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {errors[`enrollment_subject_id_${index}`]}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* Study Level Field */}
                            <Form.Group as={Col} controlId={`formStudyLevel-${index}`}>
                                <Form.Label>Study Level</Form.Label>
                                <Form.Select
                                    name="study_level_id"
                                    value={enrollment.study_level_id}
                                    onChange={(e) => handleEnrollmentChange(e, index, 'study_level_id')}
                                    isInvalid={!!errors[`enrollment_study_level_id_${index}`]}
                                >
                                    <option value="">Select Study Level</option>
                                    {availableStudyLevels(enrollment.subject_id).length > 0 ? availableStudyLevels(enrollment.subject_id) : (
                                        <option value="">No study levels available</option>
                                    )}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {errors[`enrollment_study_level_id_${index}`]}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            {/* Class Time Field */}
                            <Form.Group as={Col} controlId={`formClassTime-${index}`}>
                                <Form.Label>Class Time</Form.Label>
                                <Form.Select
                                    name="lesson_id"
                                    value={enrollment.lesson_id}
                                    onChange={(e) => handleLessonChange(e, index)}
                                    isInvalid={!!errors[`enrollment_lesson_id_${index}`]}
                                >
                                    <option value="">Select Class Time</option>
                                    {availableLessons(enrollment.subject_id).length > 0 ? availableLessons(enrollment.subject_id) : (
                                        <option value="">No class times available</option>
                                    )}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {errors[`enrollment_lesson_id_${index}`]}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Col className="d-flex justify-content-end">
                                <img
                                    className="ms-2"
                                    src="http://localhost:8000/icon/add.png"
                                    alt="Add"
                                    onClick={() => addLesson()}
                                    style={{ cursor: 'pointer' }}
                                />
                                <img
                                    className="ms-2"
                                    src="http://localhost:8000/icon/delete.png"
                                    alt="Delete"
                                    onClick={() => removeLesson(index)}
                                    style={{ cursor: 'pointer' }}
                                />
                            </Col>
                        </Row>
                    </React.Fragment>
                ))}
            </Form.Group>
        </>
    );
}