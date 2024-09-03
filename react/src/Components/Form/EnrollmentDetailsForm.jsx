// import React, { useEffect } from 'react';
// import { Form, Row, Col } from 'react-bootstrap';

// export default function SubjectEnrollmentForm({ subjects, handleSubjectChange, addSubject, removeSubject, errors }) {
//     // Ensure there's at least one subject detail field on initial render
//     useEffect(() => {
//         // If there are no subjects, add one
//         if (subjects.length === 0) {
//             addSubject();
//         }
//     }, [subjects, addSubject]);

//     return (
//         <>
//             <Form.Group controlId="subjects">
//                 {subjects.map((subject, index) => (
//                     <React.Fragment key={index}>
//                         {/* Row for Subject Name, Study Level, and Class Time */}
//                         <Row className="mb-3">
//                             <Form.Group as={Col} className="col-6">
//                                 <Form.Label>Subject Name</Form.Label>
//                                 <Form.Control
//                                     type="text"
//                                     placeholder="Enter subject name"
//                                     value={subject.name}
//                                     onChange={(e) => handleSubjectChange(e, index, 'name')}
//                                     isInvalid={!!errors[`subject_name_${index}`]}
//                                 />
//                                 <Form.Control.Feedback type="invalid">
//                                     {errors[`subject_name_${index}`] ? (
//                                         <p className="error-message">{errors[`subject_name_${index}`]}</p>
//                                     ) : null}
//                                 </Form.Control.Feedback>
//                             </Form.Group>

//                             <Form.Group as={Col} className="col-6">
//                                 <Form.Label>Study Level</Form.Label>
//                                 <Form.Select
//                                     value={subject.study_level}
//                                     onChange={(e) => handleSubjectChange(e, index, 'study_level')}
//                                     isInvalid={!!errors[`subject_study_level_${index}`]}
//                                 >
//                                     <option value="">Select study level</option>
//                                     <option value="Undergraduate">Undergraduate</option>
//                                     <option value="Graduate">Graduate</option>
//                                     <option value="Postgraduate">Postgraduate</option>
//                                 </Form.Select>
//                                 <Form.Control.Feedback type="invalid">
//                                     {errors[`subject_study_level_${index}`] ? (
//                                         <p className="error-message">{errors[`subject_study_level_${index}`]}</p>
//                                     ) : null}
//                                 </Form.Control.Feedback>
//                             </Form.Group>
//                         </Row>
//                         <Row className="mb-3">
//                             <Form.Group as={Col} >
//                                 <Form.Label>Class Time</Form.Label>
//                                 <Form.Control
//                                     type="text"
//                                     placeholder="Enter class time"
//                                     value={subject.class_time}
//                                     onChange={(e) => handleSubjectChange(e, index, 'class_time')}
//                                     isInvalid={!!errors[`subject_class_time_${index}`]}
//                                 />
//                                 <Form.Control.Feedback type="invalid">
//                                     {errors[`subject_class_time_${index}`] ? (
//                                         <p className="error-message">{errors[`subject_class_time_${index}`]}</p>
//                                     ) : null}
//                                 </Form.Control.Feedback>
//                             </Form.Group>
//                         </Row>

//                         {/* Row for Add and Remove Buttons */}
//                         <Row className="mb-3">
//                             <Col className="d-flex justify-content-end">
//                                 <img
//                                     className="ms-2"
//                                     src="http://localhost:8000/icon/add.png"
//                                     alt="Add"
//                                     onClick={addSubject}
//                                     style={{ cursor: "pointer" }}
//                                 />
//                                 <img
//                                     className="ms-2"
//                                     src="http://localhost:8000/icon/delete.png"
//                                     alt="Delete"
//                                     onClick={() => removeSubject(index)}
//                                     style={{ cursor: "pointer" }}
//                                 />
//                             </Col>
//                         </Row>
//                     </React.Fragment>
//                 ))}
//             </Form.Group>
//         </>
//     );
// }



import React, { useEffect } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

export default function EnrollmentDetailsForm({ enrollmentDetails, lessons, handleLessonChange, addLesson, removeLesson, errors }) {
    // Ensure there's at least one enrollment detail field on initial render
    useEffect(() => {
        if (enrollmentDetails.length === 0) {
            addLesson();
        }
    }, [enrollmentDetails, addLesson]);

    return (
        <>
            <Form.Group controlId="enrollments">
                {enrollmentDetails.map((enrollment, index) => (
                    <React.Fragment key={index}>
                        {/* Row for Subject and Study Level */}
                        <Row className="mb-3">
                            <Form.Group as={Col} className="col-6">
                                <Form.Label>Subject</Form.Label>
                                <Form.Select
                                    value={enrollment.lesson_id}
                                    onChange={(e) => handleLessonChange(e, index, 'lesson_id')}
                                    isInvalid={!!errors[`lesson_id_${index}`]}
                                >
                                    <option value="">Select a subject</option>
                                    {lessons.map((lesson) => (
                                        <option key={lesson.id} value={lesson.id}>
                                            {lesson.subject_name}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {errors[`lesson_id_${index}`]}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} className="col-6">
                                <Form.Label>Study Level</Form.Label>
                                <Form.Select
                                    value={enrollment.study_level}
                                    onChange={(e) => handleLessonChange(e, index, 'study_level')}
                                    isInvalid={!!errors[`study_level_${index}`]}
                                >
                                    <option value="">Select study level</option>
                                    {lessons.map((lesson) => (
                                        <option key={lesson.id} value={lesson.id}>
                                            {lesson.level_name}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {errors[`study_level_${index}`]}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        {/* Row for Class Time */}
                        <Row className="mb-3">
                            <Form.Group as={Col} className="col-12">
                                <Form.Label>Class Time</Form.Label>
                                <Form.Select
                                    value={enrollment.class_time}
                                    onChange={(e) => handleLessonChange(e, index, 'class_time')}
                                    isInvalid={!!errors[`class_time_${index}`]}
                                >
                                    <option value="">Select class time</option>
                                    {lessons.map((lesson) => (
                                        <option key={lesson.id} value={lesson.id}>
                                            {lesson.start_time} - {lesson.end_time}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {errors[`class_time_${index}`]}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>



                        {/* Row for Add and Remove Buttons */}
                        <Row className="mb-3">
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
