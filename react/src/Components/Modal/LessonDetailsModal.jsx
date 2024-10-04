import React from "react";

const LessonDetailsModal = ({ modalContent }) => {
    return (
        <>
            <div
                className="modal fade"
                id="lessonDetailsModal"
                tabIndex="-1"
                aria-labelledby="lessonDetailsModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5
                                className="modal-title"
                                id="lessonDetailsModalLabel"
                            >
                                Lesson Details
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <p>
                                <strong>Lesson ID:</strong>{" "}
                                {modalContent.lessonId}
                            </p>
                            <p>
                                <strong>Teacher:</strong>{" "}
                                {modalContent.teacherName}
                            </p>
                            <p>
                                <strong>Subject:</strong>{" "}
                                {modalContent.subjectName}
                            </p>
                            <p>
                                <strong>Start Time:</strong>{" "}
                                {modalContent.startTime}
                            </p>
                            <p>
                                <strong>End Time:</strong>{" "}
                                {modalContent.endTime}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LessonDetailsModal;
