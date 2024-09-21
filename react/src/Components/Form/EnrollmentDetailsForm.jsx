import React, { useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";

// export default function EnrollmentDetailsForm({ enrollmentDetails, handleEnrollmentChange, addLesson, removeLesson, errors, subjects, lessons }) {
//     // Ensure there's at least one enrollment detail field on initial render
//     useEffect(() => {
//         // If there are no enrollment details, add one
//         if (enrollmentDetails.length === 0) {
//             addLesson();
//         }
//     }, [enrollmentDetails, addLesson]);

//     // Extract subjects and lessons from props
//     const subjectsArray = (subjects?.subjects || []);
//     const lessonsArray = (lessons?.lessons || []);

//     // Get the study levels available for the selected subject
//     const getStudyLevelsForSubject = (subjectId) => {
//         // Find the subject based on the subjectId
//         const subject = subjectsArray.find(subject => subject.id === subjectId);
//         // If subject is not found, return an empty array
//         if (!subject) return [];
//         // Otherwise, return the study levels for the subject
//         return subjectsArray.filter(sub => sub.id === subjectId)
//             .map(sub => ({
//                 id: sub.level_id,
//                 level_name: sub.level_name
//             }));
//     };

//     // Get the lessons for the selected subject
//     const getLessonsForSubject = (subjectId) => {
//         return lessonsArray.filter(lesson => lesson.subject_id === subjectId);
//     };

//     // Updated subject change handler to use new handleEnrollmentChange
//     const handleSubjectChange = (e, index) => {
//         // Get the selected subject id
//         const selectedSubjectId = parseInt(e.target.value, 10);

//         // Reset study level and lesson when the subject changes
//         const updatedEnrollmentDetails = {
//             ...enrollmentDetails[index],
//             subject_id: selectedSubjectId,
//             study_level_id: '', // Reset study level
//             lesson_id: '', // Reset lesson
//         };

//         // Update the state using handleEnrollmentChange
//         handleEnrollmentChange(
//             { target: { value: selectedSubjectId } },
//             index,
//             'subject_id'
//         );
//         handleEnrollmentChange(
//             { target: { value: updatedEnrollmentDetails.study_level_id } },
//             index,
//             'study_level_id'
//         );
//         handleEnrollmentChange(
//             { target: { value: updatedEnrollmentDetails.lesson_id } },
//             index,
//             'lesson_id'
//         );
//     };

//     const handleLessonChange = (e, index) => {
//         // Get the selected lesson id
//         handleEnrollmentChange(e, index, 'lesson_id');
//     };

//     // Get the available subjects for the select field
//     const availableSubjects = subjectsArray.map(subject => (
//         <option key={subject.id} value={subject.id}>
//             {subject.subject_name}
//         </option>
//     ));

//     // Get the study levels available for the selected subject
//     const availableStudyLevels = (subjectId) => getStudyLevelsForSubject(subjectId).map(level => (
//         <option key={level.id} value={level.id}>
//             {level.level_name}
//         </option>
//     ));

//     // Get the lessons available for the selected subject
//     const availableLessons = (subjectId) => getLessonsForSubject(subjectId).map(lesson => (
//         <option key={lesson.id} value={lesson.id}>
//             {lesson.start_time} - {lesson.end_time} ({lesson.subject_name}, {lesson.level_name})
//         </option>
//     ));

//     return (
//         <>
//             <Form.Group controlId="enrollments">
//                 {enrollmentDetails.map((enrollment, index) => (
//                     <React.Fragment key={index}>
//                         <Row className="mb-3">
//                             {/* Subject Field */}
//                             <Form.Group as={Col} controlId={`formSubject-${index}`}>
//                                 <Form.Label>Subject</Form.Label>
//                                 <Form.Select
//                                     name="subject_id"
//                                     value={enrollment.subject_id}
//                                     onChange={(e) => handleSubjectChange(e, index)}
//                                     isInvalid={!!errors[`enrollment_subject_id_${index}`]}
//                                 >
//                                     <option value="">Select Subject</option>
//                                     {availableSubjects.length > 0 ? availableSubjects : (
//                                         <option value="">No subjects available</option>
//                                     )}
//                                 </Form.Select>
//                                 <Form.Control.Feedback type="invalid">
//                                     {errors[`enrollment_subject_id_${index}`]}
//                                 </Form.Control.Feedback>
//                             </Form.Group>

//                             {/* Study Level Field */}
//                             <Form.Group as={Col} controlId={`formStudyLevel-${index}`}>
//                                 <Form.Label>Study Level</Form.Label>
//                                 <Form.Select
//                                     name="study_level_id"
//                                     value={enrollment.study_level_id}
//                                     onChange={(e) => handleEnrollmentChange(e, index, 'study_level_id')}
//                                     isInvalid={!!errors[`enrollment_study_level_id_${index}`]}
//                                 >
//                                     <option value="">Select Study Level</option>
//                                     {availableStudyLevels(enrollment.subject_id).length > 0 ? availableStudyLevels(enrollment.subject_id) : (
//                                         <option value="">No study levels available</option>
//                                     )}
//                                 </Form.Select>
//                                 <Form.Control.Feedback type="invalid">
//                                     {errors[`enrollment_study_level_id_${index}`]}
//                                 </Form.Control.Feedback>
//                             </Form.Group>
//                         </Row>

//                         <Row className="mb-3">
//                             {/* Class Time Field */}
//                             <Form.Group as={Col} controlId={`formClassTime-${index}`}>
//                                 <Form.Label>Class Time</Form.Label>
//                                 <Form.Select
//                                     name="lesson_id"
//                                     value={enrollment.lesson_id}
//                                     onChange={(e) => handleLessonChange(e, index)}
//                                     isInvalid={!!errors[`enrollment_lesson_id_${index}`]}
//                                 >
//                                     <option value="">Select Class Time</option>
//                                     {availableLessons(enrollment.subject_id).length > 0 ? availableLessons(enrollment.subject_id) : (
//                                         <option value="">No class times available</option>
//                                     )}
//                                 </Form.Select>
//                                 <Form.Control.Feedback type="invalid">
//                                     {errors[`enrollment_lesson_id_${index}`]}
//                                 </Form.Control.Feedback>
//                             </Form.Group>
//                         </Row>

//                         <Row className="mb-3">
//                             <Col className="d-flex justify-content-end">
//                                 <img
//                                     className="ms-2"
//                                     src="http://localhost:8000/icon/add.png"
//                                     alt="Add"
//                                     onClick={() => addLesson()}
//                                     style={{ cursor: 'pointer' }}
//                                 />
//                                 <img
//                                     className="ms-2"
//                                     src="http://localhost:8000/icon/delete.png"
//                                     alt="Delete"
//                                     onClick={() => removeLesson(index)}
//                                     style={{ cursor: 'pointer' }}
//                                 />
//                             </Col>
//                         </Row>
//                     </React.Fragment>
//                 ))}
//             </Form.Group>
//         </>
//     );
// }

// export default function EnrollmentDetailsForm({ enrollmentDetails, handleEnrollmentChange, addLesson, removeLesson, errors, subjects, lessons }) {
//     // Ensure there's at least one enrollment detail field on initial render
//     useEffect(() => {
//         // If there are no enrollment details, add one
//         if (enrollmentDetails.length === 0) {
//             addLesson();
//         }
//     }, [enrollmentDetails, addLesson]);

//     // Extract subjects and lessons from props
//     const subjectsArray = (subjects?.subjects || []);
//     const lessonsArray = (lessons?.lessons || []);

//     // Get the study levels available for the selected subject
//     const getStudyLevelsForSubject = (subjectId) => {
//         // Find the subject based on the subjectId
//         const subject = subjectsArray.find(subject => subject.id === subjectId);
//         return subject ? subjectsArray.filter(sub => sub.id === subjectId).map(sub => ({
//             id: sub.level_id,
//             level_name: sub.level_name
//         })) : [];
//     };

//     // Get the lessons for the selected subject
//     const getLessonsForSubject = (subjectId) => {
//         return lessonsArray.filter(lesson => lesson.subject_id === subjectId);
//     };

//     // Consolidated handle enrollment change function
//     const handleEnrollmentChangeWrapper = (e, index, field) => {
//         const selectedValue = e.target.value;

//         if (field === 'subject_id') {
//             const selectedSubjectId = parseInt(selectedValue, 10);
//             const updatedEnrollmentDetails = {
//                 ...enrollmentDetails[index],
//                 subject_id: selectedSubjectId,
//                 study_level_id: '', // Reset study level
//                 lesson_id: '', // Reset lesson
//             };

//             // Update subject and clear errors
//             handleEnrollmentChange(
//                 { target: { value: selectedSubjectId } },
//                 index,
//                 'subject_id'
//             );

//             // Clear errors for study level and lesson fields
//             handleEnrollmentChange(
//                 { target: { value: updatedEnrollmentDetails.study_level_id } },
//                 index,
//                 'study_level_id'
//             );
//             handleEnrollmentChange(
//                 { target: { value: updatedEnrollmentDetails.lesson_id } },
//                 index,
//                 'lesson_id'
//             );

//             // Instead of deleting, set the error for subject to an empty string or null
//             handleEnrollmentChange(
//                 { target: { value: '' } },
//                 index,
//                 'enrollment_subject_id'
//             );

//         } else {
//             handleEnrollmentChange(e, index, field);
//         }
//     };

// // // Get available subjects for the select field
// // const availableSubjects = subjectsArray
// //     .filter(subject => !selectedSubjectIds.includes(subject.id)) // Exclude already selected subjects
// //     .map(subject => (
// //         <option key={subject.id} value={subject.id}>
// //             {subject.subject_name}
// //         </option>
// //     ));
// // Get available subjects excluding those already selected, except for the current subject

// // Get available subjects for each enrollment detail
// const getAvailableSubjects = (index) => {
//     // Get IDs of currently selected subjects
//     const selectedSubjectIds = enrollmentDetails
//         .map((enrollment, i) => (i !== index ? enrollment.subject_id : null))
//         .filter(id => id !== null);

//     return subjectsArray
//         .filter(subject => !selectedSubjectIds.includes(subject.id) || enrollmentDetails[index].subject_id === subject.id)
//         .map(subject => (
//             <option key={subject.id} value={subject.id}>
//                 {subject.subject_name}
//             </option>
//         ));
// };

//     // Get study levels and lessons for the selected subject
//     const availableStudyLevels = (subjectId) => getStudyLevelsForSubject(subjectId).map(level => (
//         <option key={level.id} value={level.id}>
//             {level.level_name}
//         </option>
//     ));

//     const availableLessons = (subjectId) => getLessonsForSubject(subjectId).map(lesson => (
//         <option key={lesson.id} value={lesson.id}>
//             {lesson.start_time} - {lesson.end_time} ({lesson.subject_name}, {lesson.level_name})
//         </option>
//     ));

//     return (
//         <>
//             <Form.Group controlId="enrollments">
//                 {enrollmentDetails.map((enrollment, index) => (
//                     <React.Fragment key={index}>
//                         <Row className="mb-3">
//                             {/* Subject Field */}
//                             <Form.Group as={Col} controlId={`formSubject-${index}`}>
//                                 <Form.Label>Subject</Form.Label>
//                                 <Form.Select
//                                     name="subject_id"
//                                     value={enrollment.subject_id}
//                                     onChange={(e) => handleEnrollmentChangeWrapper(e, index, 'subject_id')}
//                                     isInvalid={!!errors[`enrollment_subject_id_${index}`]}
//                                 >
//                                     <option value="">Select Subject</option>
//                                     {getAvailableSubjects(index).length > 0 ? getAvailableSubjects(index) : (
//                                         <option value="">No subjects available</option>
//                                     )}
//                                 </Form.Select>
//                                 <Form.Control.Feedback type="invalid">
//                                     {errors[`enrollment_subject_id_${index}`]}
//                                 </Form.Control.Feedback>
//                             </Form.Group>

//                             {/* Study Level Field */}
//                             <Form.Group as={Col} controlId={`formStudyLevel-${index}`}>
//                                 <Form.Label>Study Level</Form.Label>
//                                 <Form.Select
//                                     name="study_level_id"
//                                     value={enrollment.study_level_id}
//                                     onChange={(e) => handleEnrollmentChangeWrapper(e, index, 'study_level_id')}
//                                     isInvalid={!!errors[`enrollment_study_level_id_${index}`]}
//                                 >
//                                     <option value="">Select Study Level</option>
//                                     {availableStudyLevels(enrollment.subject_id).length > 0 ? availableStudyLevels(enrollment.subject_id) : (
//                                         <option value="">No study levels available</option>
//                                     )}
//                                 </Form.Select>
//                                 <Form.Control.Feedback type="invalid">
//                                     {errors[`enrollment_study_level_id_${index}`]}
//                                 </Form.Control.Feedback>
//                             </Form.Group>
//                         </Row>

//                         <Row className="mb-3">
//                             {/* Class Time Field */}
//                             <Form.Group as={Col} controlId={`formClassTime-${index}`}>
//                                 <Form.Label>Class Time</Form.Label>
//                                 <Form.Select
//                                     name="lesson_id"
//                                     value={enrollment.lesson_id}
//                                     onChange={(e) => handleEnrollmentChangeWrapper(e, index, 'lesson_id')}
//                                     isInvalid={!!errors[`enrollment_lesson_id_${index}`]}
//                                 >
//                                     <option value="">Select Class Time</option>
//                                     {availableLessons(enrollment.subject_id).length > 0 ? availableLessons(enrollment.subject_id) : (
//                                         <option value="">No class times available</option>
//                                     )}
//                                 </Form.Select>
//                                 <Form.Control.Feedback type="invalid">
//                                     {errors[`enrollment_lesson_id_${index}`]}
//                                 </Form.Control.Feedback>
//                             </Form.Group>
//                         </Row>

//                         <Row className="mb-3">
//                             <Col className="d-flex justify-content-end">
//                                 <img
//                                     className="ms-2"
//                                     src="http://localhost:8000/icon/add.png"
//                                     alt="Add"
//                                     onClick={() => addLesson()}
//                                     style={{ cursor: 'pointer' }}
//                                 />
//                                 <img
//                                     className="ms-2"
//                                     src="http://localhost:8000/icon/delete.png"
//                                     alt="Delete"
//                                     onClick={() => removeLesson(index)}
//                                     style={{ cursor: 'pointer' }}
//                                 />
//                             </Col>
//                         </Row>
//                     </React.Fragment>
//                 ))}
//             </Form.Group>
//         </>
//     );
// }

// export default function EnrollmentDetailsForm({ enrollmentDetails, handleEnrollmentChange, addLesson, removeLesson, errors, subjects, lessons, rooms }) {
//     // Ensure there's at least one enrollment detail field on initial render
//     useEffect(() => {
//         // If there are no enrollment details, add one
//         if (enrollmentDetails.length === 0) {
//             addLesson();
//         }
//     }, [enrollmentDetails, addLesson]);

//     // Extract subjects and lessons from props
//     const subjectsArray = (subjects?.subjects || []);
//     const lessonsArray = (lessons?.lessons || []);
//     const roomsArray = (rooms?.rooms || []);
//     const daysOfWeek = [
//         "Sunday",
//         "Monday",
//         "Tuesday",
//         "Wednesday",
//         "Thursday",
//         "Friday",
//         "Saturday",
//     ];
//     const getRoomName = (roomId, rooms) => {
//         const room = rooms.find((room) => room.id === roomId);
//         return room ? room.room_name : "Unknown Room"; // Default if room not found
//     };

//     // Get the study levels available for the selected subject
//     const getStudyLevelsForSubject = (subjectId) => {
//         // Find the subject based on the subjectId
//         const subject = subjectsArray.find(subject => subject.id === subjectId);
//         return subject ? subjectsArray.filter(sub => sub.id === subjectId).map(sub => ({
//             id: sub.level_id,
//             level_name: sub.level_name
//         })) : [];
//     };

//     // Get the lessons for the selected subject
//     const getLessonsForSubject = (subjectId) => {
//         return lessonsArray.filter(lesson => lesson.subject_id === subjectId);
//     };

//     // Consolidated handle enrollment change function
//     const handleEnrollmentChangeWrapper = (e, index, field) => {
//         const selectedValue = e.target.value;

//         if (field === 'subject_id') {
//             const selectedSubjectId = parseInt(selectedValue, 10);
//             const updatedEnrollmentDetails = {
//                 ...enrollmentDetails[index],
//                 subject_id: selectedSubjectId,
//                 study_level_id: '', // Reset study level
//                 lesson_id: '', // Reset lesson
//             };

//             // Update subject and clear errors
//             handleEnrollmentChange(
//                 { target: { value: selectedSubjectId } },
//                 index,
//                 'subject_id'
//             );

//             // Clear errors for study level and lesson fields
//             handleEnrollmentChange(
//                 { target: { value: updatedEnrollmentDetails.study_level_id } },
//                 index,
//                 'study_level_id'
//             );
//             handleEnrollmentChange(
//                 { target: { value: updatedEnrollmentDetails.lesson_id } },
//                 index,
//                 'lesson_id'
//             );

//             // Instead of deleting, set the error for subject to an empty string or null
//             handleEnrollmentChange(
//                 { target: { value: '' } },
//                 index,
//                 'enrollment_subject_id'
//             );

//         } else {
//             handleEnrollmentChange(e, index, field);
//         }
//     };

// // Get available subjects for each enrollment detail
// const getAvailableSubjects = (index) => {
//     // Get IDs of currently selected subjects
//     const selectedSubjectIds = enrollmentDetails
//         .map((enrollment, i) => (i !== index ? enrollment.subject_id : null))
//         .filter(id => id !== null);

//     return subjectsArray
//         .filter(subject => !selectedSubjectIds.includes(subject.id) || enrollmentDetails[index].subject_id === subject.id)
//         .map(subject => (
//             <option key={subject.id} value={subject.id}>
//                 {subject.subject_name}
//             </option>
//         ));
// };

//     // Get study levels and lessons for the selected subject
//     const availableStudyLevels = (subjectId) => getStudyLevelsForSubject(subjectId).map(level => (
//         <option key={level.id} value={level.id}>
//             {level.level_name}
//         </option>
//     ));

//     const availableLessons = (subjectId) => getLessonsForSubject(subjectId).map(lesson => (
//         <option key={lesson.id} value={lesson.id}>
//             {lesson.start_time} - {lesson.end_time} ({daysOfWeek[lesson.day]}, {getRoomName(lesson.room_id, roomsArray)})
//         </option>
//     ));

//     return (
//         <>
//             <Form.Group controlId="enrollments">
//                 {enrollmentDetails.map((enrollment, index) => (
//                     <React.Fragment key={index}>
//                         <Row className="mb-3">
//                             {/* Subject Field */}
//                             <Form.Group as={Col} controlId={`formSubject-${index}`}>
//                                 <Form.Label>Subject</Form.Label>
//                                 <Form.Select
//                                     name="subject_id"
//                                     value={enrollment.subject_id}
//                                     onChange={(e) => handleEnrollmentChangeWrapper(e, index, 'subject_id')}
//                                     isInvalid={!!errors[`enrollment_subject_id_${index}`]}
//                                 >
//                                     <option value="">Select Subject</option>
//                                     {getAvailableSubjects(index).length > 0 ? getAvailableSubjects(index) : (
//                                         <option value="">No subjects available</option>
//                                     )}
//                                 </Form.Select>
//                                 <Form.Control.Feedback type="invalid">
//                                     {errors[`enrollment_subject_id_${index}`]}
//                                 </Form.Control.Feedback>
//                             </Form.Group>

//                             {/* Study Level Field */}
//                             <Form.Group as={Col} controlId={`formStudyLevel-${index}`}>
//                                 <Form.Label>Study Level</Form.Label>
//                                 <Form.Select
//                                     name="study_level_id"
//                                     value={enrollment.study_level_id}
//                                     onChange={(e) => handleEnrollmentChangeWrapper(e, index, 'study_level_id')}
//                                     isInvalid={!!errors[`enrollment_study_level_id_${index}`]}
//                                 >
//                                     <option value="">Select Study Level</option>
//                                     {availableStudyLevels(enrollment.subject_id).length > 0 ? availableStudyLevels(enrollment.subject_id) : (
//                                         <option value="">No study levels available</option>
//                                     )}
//                                 </Form.Select>
//                                 <Form.Control.Feedback type="invalid">
//                                     {errors[`enrollment_study_level_id_${index}`]}
//                                 </Form.Control.Feedback>
//                             </Form.Group>
//                         </Row>

//                         <Row className="mb-3">
//                             {/* Class Time Field */}
//                             <Form.Group as={Col} controlId={`formClassTime-${index}`}>
//                                 <Form.Label>Class Time</Form.Label>
//                                 <Form.Select
//                                     name="lesson_id"
//                                     value={enrollment.lesson_id}
//                                     onChange={(e) => handleEnrollmentChangeWrapper(e, index, 'lesson_id')}
//                                     isInvalid={!!errors[`enrollment_lesson_id_${index}`]}
//                                 >
//                                     <option value="">Select Class Time</option>
//                                     {availableLessons(enrollment.subject_id).length > 0 ? availableLessons(enrollment.subject_id) : (
//                                         <option value="">No class times available</option>
//                                     )}
//                                 </Form.Select>
//                                 <Form.Control.Feedback type="invalid">
//                                     {errors[`enrollment_lesson_id_${index}`]}
//                                 </Form.Control.Feedback>
//                             </Form.Group>
//                         </Row>

//                         <Row className="mb-3">
//                             <Col className="d-flex justify-content-end">
//                                 <img
//                                     className="ms-2"
//                                     src="http://localhost:8000/icon/add.png"
//                                     alt="Add"
//                                     onClick={() => addLesson()}
//                                     style={{ cursor: 'pointer' }}
//                                 />
//                                 <img
//                                     className="ms-2"
//                                     src="http://localhost:8000/icon/delete.png"
//                                     alt="Delete"
//                                     onClick={() => removeLesson(index)}
//                                     style={{ cursor: 'pointer' }}
//                                 />
//                             </Col>
//                         </Row>
//                     </React.Fragment>
//                 ))}
//             </Form.Group>
//         </>
//     );
// }

// export default function EnrollmentDetailsForm({ enrollmentDetails, handleEnrollmentChange, addLesson, removeLesson, errors, subjects, lessons, rooms }) {
//     // Ensure there's at least one enrollment detail field on initial render
//     useEffect(() => {
//         // If there are no enrollment details, add one
//         if (enrollmentDetails.length === 0) {
//             addLesson();
//         }
//     }, [enrollmentDetails, addLesson]);

//     // Extract subjects and lessons from props
//     const subjectsArray = (subjects?.subjects || []);
//     const lessonsArray = (lessons?.lessons || []);
//     const roomsArray = (rooms?.rooms || []);
//     const daysOfWeek = [
//         "Sunday",
//         "Monday",
//         "Tuesday",
//         "Wednesday",
//         "Thursday",
//         "Friday",
//         "Saturday",
//     ];
//     const getRoomName = (roomId, rooms) => {
//         const room = rooms.find((room) => room.id === roomId);
//         return room ? room.room_name : "Unknown Room"; // Default if room not found
//     };

//     const checkForClashes = (newLesson, existingEnrollments) => {
//         const { start_time: newStart, end_time: newEnd, day } = newLesson;

//         return existingEnrollments.some((enrollment) => {
//             console.log("Checking enrollment:", enrollment);
//             const lesson = lessonsArray.find(lesson => lesson.id === parseInt(enrollment.lesson_id, 10));
//             console.log("Found lesson:", lesson);

//             if (lesson && lesson.day === day) {
//                 return (
//                     (newStart >= lesson.start_time && newStart < lesson.end_time) ||
//                     (newEnd > lesson.start_time && newEnd <= lesson.end_time) ||
//                     (newStart <= lesson.start_time && newEnd >= lesson.end_time)
//                 );
//             }
//             return false;
//         });

//     };

//     // Get the study levels available for the selected subject
//     const getStudyLevelsForSubject = (subjectId) => {
//         // Find the subject based on the subjectId
//         const subject = subjectsArray.find(subject => subject.id === subjectId);
//         return subject ? subjectsArray.filter(sub => sub.id === subjectId).map(sub => ({
//             id: sub.level_id,
//             level_name: sub.level_name
//         })) : [];
//     };

//     // Get the lessons for the selected subject
//     const getLessonsForSubject = (subjectId) => {
//         return lessonsArray.filter(lesson => lesson.subject_id === subjectId);
//     };

//     // Consolidated handle enrollment change function
//     const handleEnrollmentChangeWrapper = (e, index, field) => {
//         const selectedValue = e.target.value;

//         if (field === 'subject_id') {
//             const selectedSubjectId = parseInt(selectedValue, 10);
//             const updatedEnrollmentDetails = {
//                 ...enrollmentDetails[index],
//                 subject_id: selectedSubjectId,
//                 study_level_id: '', // Reset study level
//                 lesson_id: '', // Reset lesson
//             };

//             // Update subject and clear errors
//             handleEnrollmentChange(
//                 { target: { value: selectedSubjectId } },
//                 index,
//                 'subject_id'
//             );

//             // Clear errors for study level and lesson fields
//             handleEnrollmentChange(
//                 { target: { value: updatedEnrollmentDetails.study_level_id } },
//                 index,
//                 'study_level_id'
//             );
//             handleEnrollmentChange(
//                 { target: { value: updatedEnrollmentDetails.lesson_id } },
//                 index,
//                 'lesson_id'
//             );

//             // Instead of deleting, set the error for subject to an empty string or null
//             handleEnrollmentChange(
//                 { target: { value: '' } },
//                 index,
//                 'enrollment_subject_id'
//             );

//         } else {
//             handleEnrollmentChange(e, index, field);
//         }
//     };

// // Get available subjects for each enrollment detail
// const getAvailableSubjects = (index) => {
//     // Get IDs of currently selected subjects
//     const selectedSubjectIds = enrollmentDetails
//         .map((enrollment, i) => (i !== index ? enrollment.subject_id : null))
//         .filter(id => id !== null);

//     return subjectsArray
//         .filter(subject => !selectedSubjectIds.includes(subject.id) || enrollmentDetails[index].subject_id === subject.id)
//         .map(subject => (
//             <option key={subject.id} value={subject.id}>
//                 {subject.subject_name}
//             </option>
//         ));
// };

//     // Get study levels and lessons for the selected subject
//     const availableStudyLevels = (subjectId) => getStudyLevelsForSubject(subjectId).map(level => (
//         <option key={level.id} value={level.id}>
//             {level.level_name}
//         </option>
//     ));

//     const availableLessons = (subjectId) => {
//         const lessonsForSubject = getLessonsForSubject(subjectId);

//         console.log("Filtered lessons for subject:", lessonsForSubject);

//         // Filter out lessons that clash with already enrolled lessons
//         return lessonsForSubject.filter(lesson => {
//             const enrollmentIndex = enrollmentDetails.findIndex(enrollment => enrollment.subject_id === subjectId);
//             if (enrollmentIndex === -1) return true; // No enrollment for this subject

//             // Check for clashes with existing enrollments
//             return !checkForClashes(lesson, enrollmentDetails);
//         }).map(lesson => (
//             <option key={lesson.id} value={lesson.id}>
//                 {lesson.start_time} - {lesson.end_time} ({daysOfWeek[lesson.day]}, {getRoomName(lesson.room_id, roomsArray)})
//             </option>
//         ));
//     };

//     return (
//         <>
//             <Form.Group controlId="enrollments">
//                 {enrollmentDetails.map((enrollment, index) => (
//                     <React.Fragment key={index}>
//                         <Row className="mb-3">
//                             {/* Subject Field */}
//                             <Form.Group as={Col} controlId={`formSubject-${index}`}>
//                                 <Form.Label>Subject</Form.Label>
//                                 <Form.Select
//                                     name="subject_id"
//                                     value={enrollment.subject_id}
//                                     onChange={(e) => handleEnrollmentChangeWrapper(e, index, 'subject_id')}
//                                     isInvalid={!!errors[`enrollment_subject_id_${index}`]}
//                                 >
//                                     <option value="">Select Subject</option>
//                                     {getAvailableSubjects(index).length > 0 ? getAvailableSubjects(index) : (
//                                         <option value="">No subjects available</option>
//                                     )}
//                                 </Form.Select>
//                                 <Form.Control.Feedback type="invalid">
//                                     {errors[`enrollment_subject_id_${index}`]}
//                                 </Form.Control.Feedback>
//                             </Form.Group>

//                             {/* Study Level Field */}
//                             <Form.Group as={Col} controlId={`formStudyLevel-${index}`}>
//                                 <Form.Label>Study Level</Form.Label>
//                                 <Form.Select
//                                     name="study_level_id"
//                                     value={enrollment.study_level_id}
//                                     onChange={(e) => handleEnrollmentChangeWrapper(e, index, 'study_level_id')}
//                                     isInvalid={!!errors[`enrollment_study_level_id_${index}`]}
//                                 >
//                                     <option value="">Select Study Level</option>
//                                     {availableStudyLevels(enrollment.subject_id).length > 0 ? availableStudyLevels(enrollment.subject_id) : (
//                                         <option value="">No study levels available</option>
//                                     )}
//                                 </Form.Select>
//                                 <Form.Control.Feedback type="invalid">
//                                     {errors[`enrollment_study_level_id_${index}`]}
//                                 </Form.Control.Feedback>
//                             </Form.Group>
//                         </Row>

//                         <Row className="mb-3">
//                             {/* Class Time Field */}
//                             <Form.Group as={Col} controlId={`formClassTime-${index}`}>
//                                  <Form.Label>Class Time</Form.Label>
//                                  <Form.Select
//                                     name="lesson_id"
//                                     value={enrollment.lesson_id}
//                                     onChange={(e) => handleEnrollmentChangeWrapper(e, index, 'lesson_id')}
//                                     isInvalid={!!errors[`enrollment_lesson_id_${index}`]}
//                                 >
//                                     <option value="">Select Class Time</option>
//                                     {availableLessons(enrollment.subject_id).length > 0 ? availableLessons(enrollment.subject_id) : (
//                                         <option value="">No class times available</option>
//                                     )}
//                                 </Form.Select>
//                                 <Form.Control.Feedback type="invalid">
//                                     {errors[`enrollment_lesson_id_${index}`]}
//                                 </Form.Control.Feedback>
//                             </Form.Group>

//                         </Row>

//                         <Row className="mb-3">
//                             <Col className="d-flex justify-content-end">
//                                 <img
//                                     className="ms-2"
//                                     src="http://localhost:8000/icon/add.png"
//                                     alt="Add"
//                                     onClick={() => addLesson()}
//                                     style={{ cursor: 'pointer' }}
//                                 />
//                                 <img
//                                     className="ms-2"
//                                     src="http://localhost:8000/icon/delete.png"
//                                     alt="Delete"
//                                     onClick={() => removeLesson(index)}
//                                     style={{ cursor: 'pointer' }}
//                                 />
//                             </Col>
//                         </Row>
//                     </React.Fragment>
//                 ))}
//             </Form.Group>
//         </>
//     );
// }

// export default function EnrollmentDetailsForm({ enrollmentDetails, handleEnrollmentChange, addLesson, removeLesson, errors, subjects, lessons, rooms }) {
//     // Ensure there's at least one enrollment detail field on initial render
//     useEffect(() => {
//         // If there are no enrollment details, add one
//         if (enrollmentDetails.length === 0) {
//             addLesson();
//         }
//     }, [enrollmentDetails, addLesson]);

//     // Extract subjects and lessons from props
//     const subjectsArray = (subjects?.subjects || []);
//     const lessonsArray = (lessons?.lessons || []);
//     const roomsArray = (rooms?.rooms || []);
//     const daysOfWeek = [
//         "Sunday",
//         "Monday",
//         "Tuesday",
//         "Wednesday",
//         "Thursday",
//         "Friday",
//         "Saturday",
//     ];
//     const getRoomName = (roomId, rooms) => {
//         const room = rooms.find((room) => room.id === roomId);
//         return room ? room.room_name : "Unknown Room"; // Default if room not found
//     };

//      // Function to check if there's a clash with existing lessons
//      const checkForClashes = (lesson) => {
//         return enrollmentDetails.some(enrollment => {
//             const selectedLesson = lessonsArray.find(l => l.id === parseInt(enrollment.lesson_id, 10));

//             // If there's no selected lesson, no clash
//             if (!selectedLesson) return false;

//             // Check if day is the same and the times overlap
//             return selectedLesson.day === lesson.day && (
//                 (lesson.start_time >= selectedLesson.start_time && lesson.start_time < selectedLesson.end_time) ||
//                 (lesson.end_time > selectedLesson.start_time && lesson.end_time <= selectedLesson.end_time)
//             );
//         });
//     };
//     // const checkForClashes = (newLesson, existingEnrollments) => {
//     //             const { start_time: newStart, end_time: newEnd, day } = newLesson;

//     //             return existingEnrollments.some((enrollment) => {
//     //                 console.log("Checking enrollment:", enrollment);
//     //                 const lesson = lessonsArray.find(lesson => lesson.id === parseInt(enrollment.lesson_id, 10));
//     //                 console.log("Found lesson:", lesson);

//     //                 if (lesson && lesson.day === day) {
//     //                     return (
//     //                         (newStart >= lesson.start_time && newStart < lesson.end_time) ||
//     //                         (newEnd > lesson.start_time && newEnd <= lesson.end_time) ||
//     //                         (newStart <= lesson.start_time && newEnd >= lesson.end_time)
//     //                     );
//     //                 }
//     //                 return false;
//     //             });

//     //         };

//              // Get the study levels available for the selected subject
//     const getStudyLevelsForSubject = (subjectId) => {
//         // Find the subject based on the subjectId
//         const subject = subjectsArray.find(subject => subject.id === subjectId);
//         return subject ? subjectsArray.filter(sub => sub.id === subjectId).map(sub => ({
//             id: sub.level_id,
//             level_name: sub.level_name
//         })) : [];
//     };

//     // Get the lessons for the selected subject
//     const getLessonsForSubject = (subjectId) => {
//         return lessonsArray.filter(lesson => lesson.subject_id === subjectId);
//     };

//     // Consolidated handle enrollment change function
//     const handleEnrollmentChangeWrapper = (e, index, field) => {
//         const selectedValue = e.target.value;

//         if (field === 'subject_id') {
//             const selectedSubjectId = parseInt(selectedValue, 10);
//             const updatedEnrollmentDetails = {
//                 ...enrollmentDetails[index],
//                 subject_id: selectedSubjectId,
//                 study_level_id: '', // Reset study level
//                 lesson_id: '', // Reset lesson
//             };

//             // Update subject and clear errors
//             handleEnrollmentChange(
//                 { target: { value: selectedSubjectId } },
//                 index,
//                 'subject_id'
//             );

//             // Clear errors for study level and lesson fields
//             handleEnrollmentChange(
//                 { target: { value: updatedEnrollmentDetails.study_level_id } },
//                 index,
//                 'study_level_id'
//             );
//             handleEnrollmentChange(
//                 { target: { value: updatedEnrollmentDetails.lesson_id } },
//                 index,
//                 'lesson_id'
//             );

//             // Instead of deleting, set the error for subject to an empty string or null
//             handleEnrollmentChange(
//                 { target: { value: '' } },
//                 index,
//                 'enrollment_subject_id'
//             );

//         } else {
//             handleEnrollmentChange(e, index, field);
//         }
//     };

// // Get available subjects for each enrollment detail
// const getAvailableSubjects = (index) => {
//     // Get IDs of currently selected subjects
//     const selectedSubjectIds = enrollmentDetails
//         .map((enrollment, i) => (i !== index ? enrollment.subject_id : null))
//         .filter(id => id !== null);

//     return subjectsArray
//         .filter(subject => !selectedSubjectIds.includes(subject.id) || enrollmentDetails[index].subject_id === subject.id)
//         .map(subject => (
//             <option key={subject.id} value={subject.id}>
//                 {subject.subject_name}
//             </option>
//         ));
// };

//     // Get study levels and lessons for the selected subject
//     const availableStudyLevels = (subjectId) => getStudyLevelsForSubject(subjectId).map(level => (
//         <option key={level.id} value={level.id}>
//             {level.level_name}
//         </option>
//     ));

//     // Get available lessons for the selected subject, disable clashes
//     const availableLessons = (subjectId) => {
//         return getLessonsForSubject(subjectId).map(lesson => {
//             const isClashing = checkForClashes(lesson);
//             return (
//                 <option key={lesson.id} value={lesson.id} disabled={isClashing}>
//                     {lesson.start_time} - {lesson.end_time} ({daysOfWeek[lesson.day]}, {getRoomName(lesson.room_id, roomsArray)})
//                     {isClashing && " (Clashing)"}
//                 </option>
//             );
//         });
//     };

//     // const availableLessons = (subjectId) => {
//     //             const lessonsForSubject = getLessonsForSubject(subjectId);

//     //             console.log("Filtered lessons for subject:", lessonsForSubject);

//     //             // Filter out lessons that clash with already enrolled lessons
//     //             return lessonsForSubject.filter(lesson => {
//     //                 const enrollmentIndex = enrollmentDetails.findIndex(enrollment => enrollment.subject_id === subjectId);
//     //                 if (enrollmentIndex === -1) return true; // No enrollment for this subject

//     //                 // Check for clashes with existing enrollments
//     //                 return !checkForClashes(lesson, enrollmentDetails);
//     //             }).map(lesson => (
//     //                 <option key={lesson.id} value={lesson.id}>
//     //                     {lesson.start_time} - {lesson.end_time} ({daysOfWeek[lesson.day]}, {getRoomName(lesson.room_id, roomsArray)})
//     //                 </option>
//     //             ));
//     //         };

//     return (
//         <>
//             <Form.Group controlId="enrollments">
//                 {enrollmentDetails.map((enrollment, index) => (
//                     <React.Fragment key={index}>
//                         <Row className="mb-3">
//                             {/* Subject Field */}
//                             <Form.Group as={Col} controlId={`formSubject-${index}`}>
//                                 <Form.Label>Subject</Form.Label>
//                                 <Form.Select
//                                     name="subject_id"
//                                     value={enrollment.subject_id}
//                                     onChange={(e) => handleEnrollmentChangeWrapper(e, index, 'subject_id')}
//                                     isInvalid={!!errors[`enrollment_subject_id_${index}`]}
//                                 >
//                                     <option value="">Select Subject</option>
//                                     {getAvailableSubjects(index).length > 0 ? getAvailableSubjects(index) : (
//                                         <option value="">No subjects available</option>
//                                     )}
//                                 </Form.Select>
//                                 <Form.Control.Feedback type="invalid">
//                                     {errors[`enrollment_subject_id_${index}`]}
//                                 </Form.Control.Feedback>
//                             </Form.Group>

//                             {/* Study Level Field */}
//                             <Form.Group as={Col} controlId={`formStudyLevel-${index}`}>
//                                 <Form.Label>Study Level</Form.Label>
//                                 <Form.Select
//                                     name="study_level_id"
//                                     value={enrollment.study_level_id}
//                                     onChange={(e) => handleEnrollmentChangeWrapper(e, index, 'study_level_id')}
//                                     isInvalid={!!errors[`enrollment_study_level_id_${index}`]}
//                                 >
//                                     <option value="">Select Study Level</option>
//                                     {availableStudyLevels(enrollment.subject_id).length > 0 ? availableStudyLevels(enrollment.subject_id) : (
//                                         <option value="">No study levels available</option>
//                                     )}
//                                 </Form.Select>
//                                 <Form.Control.Feedback type="invalid">
//                                     {errors[`enrollment_study_level_id_${index}`]}
//                                 </Form.Control.Feedback>
//                             </Form.Group>
//                         </Row>

//                         <Row className="mb-3">
//                             {/* Class Time Field */}
//                             <Form.Group as={Col} controlId={`formClassTime-${index}`}>
//                                 <Form.Label>Class Time</Form.Label>
//                                 <Form.Select
//                                     name="lesson_id"
//                                     value={enrollment.lesson_id}
//                                     onChange={(e) => handleEnrollmentChangeWrapper(e, index, 'lesson_id')}
//                                     isInvalid={!!errors[`enrollment_lesson_id_${index}`]}
//                                 >
//                                     <option value="">Select Class Time</option>
//                                     {availableLessons(enrollment.subject_id).length > 0 ? availableLessons(enrollment.subject_id) : (
//                                         <option value="">No class times available</option>
//                                     )}
//                                 </Form.Select>
//                                 <Form.Control.Feedback type="invalid">
//                                     {errors[`enrollment_lesson_id_${index}`]}
//                                 </Form.Control.Feedback>
//                             </Form.Group>
//                         </Row>

//                         <Row className="mb-3">
//                             <Col className="d-flex justify-content-end">
//                                 <img
//                                     className="ms-2"
//                                     src="http://localhost:8000/icon/add.png"
//                                     alt="Add"
//                                     onClick={() => addLesson()}
//                                     style={{ cursor: 'pointer' }}
//                                 />
//                                 <img
//                                     className="ms-2"
//                                     src="http://localhost:8000/icon/delete.png"
//                                     alt="Delete"
//                                     onClick={() => removeLesson(index)}
//                                     style={{ cursor: 'pointer' }}
//                                 />
//                             </Col>
//                         </Row>
//                     </React.Fragment>
//                 ))}
//             </Form.Group>
//         </>
//     );
// }

export default function EnrollmentDetailsForm({
    enrollmentDetails,
    handleEnrollmentChange,
    addLesson,
    removeLesson,
    errors,
    subjects,
    lessons,
    rooms,
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

    // Get the room name based on the room ID
    const getRoomName = (roomId, rooms) => {
        const room = rooms.find((room) => room.id === roomId);
        return room ? room.room_name : "Unknown Room";
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

    // Get the study levels available for the selected subject
    const getStudyLevelsForSubject = (subjectId) => {
        // Find the subject based on the subjectId
        const subject = subjectsArray.find(
            (subject) => subject.id === subjectId
        );
        // If the subject is found, return the study levels for the subject
        // Otherwise, return an empty array
        return subject
            ? subjectsArray
                  .filter((sub) => sub.id === subjectId) // Filter the subjects based on the subject ID
                  .map((sub) => ({
                      // Map the subjects to an object with the level ID and level name
                      id: sub.level_id,
                      level_name: sub.level_name,
                  }))
            : [];
    };

    // Get the lessons for the selected subject
    const getLessonsForSubject = (subjectId) => {
        // Filter the lessons based on the subject ID
        // Return the lessons for the selected subject
        // If there are no lessons, return an empty array
        return lessonsArray.filter((lesson) => lesson.subject_id === subjectId);
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
            const selectedSubjectId = parseInt(selectedValue, 10);
            const updatedEnrollmentDetails = {
                ...enrollmentDetails[index],
                subject_id: selectedSubjectId,
                study_level_id: "", // Reset study level
                lesson_id: "", // Reset lesson
            };

            // Update subject and clear errors
            handleEnrollmentChange(
                { target: { value: selectedSubjectId } },
                index,
                "subject_id"
            );

            // Clear errors for study level and lesson fields
            handleEnrollmentChange(
                { target: { value: updatedEnrollmentDetails.study_level_id } },
                index,
                "study_level_id"
            );
            handleEnrollmentChange(
                { target: { value: updatedEnrollmentDetails.lesson_id } },
                index,
                "lesson_id"
            );

            // Instead of deleting, set the error for subject to an empty string or null
            handleEnrollmentChange(
                { target: { value: "" } },
                index,
                "enrollment_subject_id"
            );
        } else {
            handleEnrollmentChange(e, index, field);
        }
    };

    // Get available subjects for each enrollment detail
    const getAvailableSubjects = (index) => {
        // Get IDs of currently selected subjects
        const selectedSubjectIds = enrollmentDetails
            .map(
                (
                    enrollment,
                    i // Map the enrollment details
                ) => (i !== index ? enrollment.subject_id : null) // If the index is not the current index, get the subject ID
            )
            .filter((id) => id !== null); // Filter out the null values

        // Filter the subjects based on the selected subject IDs
        // If the subject is not selected or the subject ID is the same as the subject ID in the enrollment detail
        // Map the subjects to an option element
        // If there are available subjects, return the subjects
        // Otherwise, return a message that there are no subjects available
        return subjectsArray
            .filter(
                (subject) =>
                    !selectedSubjectIds.includes(subject.id) ||
                    enrollmentDetails[index].subject_id === subject.id
            )
            .map((subject) => (
                <option key={subject.id} value={subject.id}>
                    {subject.subject_name}
                </option>
            ));
    };

    // Get study levels for the selected subject
    const availableStudyLevels = (subjectId) =>
        getStudyLevelsForSubject(subjectId).map((level) => (
            <option key={level.id} value={level.id}>
                {level.level_name}
            </option>
        ));

    // Get available lessons for the selected subject
    // Disable lessons that clash with existing lessons
    // If there are available lessons, return the lessons
    // Otherwise, return a message that there are no lessons available
    const availableLessons = (subjectId, currentIndex) => {
        return getLessonsForSubject(subjectId).map((lesson) => {
            const isClashing = checkForClashes(lesson, currentIndex);
            return (
                <option key={lesson.id} value={lesson.id} disabled={isClashing}>
                    {lesson.start_time} - {lesson.end_time} (
                    {daysOfWeek[lesson.day]},{" "}
                    {getRoomName(lesson.room_id, roomsArray)})
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
                        <Row className="mb-3">
                            {/* Subject Field */}
                            <Form.Group
                                as={Col}
                                controlId={`formSubject-${index}`}
                            >
                                <Form.Label>Subject</Form.Label>
                                <Form.Select
                                    name="subject_id"
                                    value={enrollment.subject_id}
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
                                    {getAvailableSubjects(index).length > 0 ? (
                                        getAvailableSubjects(index)
                                    ) : (
                                        <option value="">
                                            No subjects available
                                        </option>
                                    )}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {errors[`enrollment_subject_id_${index}`]}
                                </Form.Control.Feedback>
                            </Form.Group>

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
                                    <option value="">Select Study Level</option>
                                    {availableStudyLevels(enrollment.subject_id)
                                        .length > 0 ? (
                                        availableStudyLevels(
                                            enrollment.subject_id
                                        )
                                    ) : (
                                        <option value="">
                                            No study levels available
                                        </option>
                                    )}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {
                                        errors[
                                            `enrollment_study_level_id_${index}`
                                        ]
                                    }
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            {/* Class Time Field */}
                            <Form.Group
                                as={Col}
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
                                    <option value="">Select Class Time</option>
                                    {availableLessons(
                                        enrollment.subject_id,
                                        index
                                    ).length > 0 ? (
                                        availableLessons(
                                            enrollment.subject_id,
                                            index
                                        )
                                    ) : (
                                        <option value="">
                                            No class times available
                                        </option>
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
