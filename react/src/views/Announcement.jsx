import React, { useState, useEffect } from "react";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import { useStateContext } from "../contexts/ContextProvider";
import { Link } from "react-router-dom";
import ParentCount from "../components/Announcement/ParentCount";
import SendAnnouncement from "./SendAnnouncement";
import { Table } from "../components/Table/Table";
import Button from "../components/Button/Button";
import ConfirmationModal from "../components/Modal/ConfirmationModal";
import axiosClient from "../axiosClient";
import "../css/Announcement.css";

export default function Announcement() {
    const [displayAnnouncements, setAnnouncements] = useState({
        loading: true,
        announcements: [],
    });

    // Function to format the date
    const formatDate = (dateString) => {
        const options = { day: "numeric", month: "short", year: "numeric" };
        return new Date(dateString).toLocaleDateString("en-GB", options);
    };

    // Helper function to convert 24-hour time to 12-hour format
    function formatTimeTo12Hour(time) {
        if (!time || typeof time !== "string") {
            return "TBA"; // Return a default value if time is invalid
        }

        let [hour, minute] = time.split(":"); // Split the time into hour and minute
        hour = parseInt(hour, 10); // Convert hour string to an integer

        const ampm = hour >= 12 ? "pm" : "am"; // Determine AM or PM
        hour = hour % 12 || 12; // Convert to 12-hour format, 0 becomes 12

        return `${hour}:${minute} ${ampm}`; // Return formatted time with minutes
    }

    // Variable to update table instantly
    const [isChange, setIsChange] = useState(false);

    useEffect(() => {
        async function fetchAnnouncements() {
            try {
                const res = await axiosClient.get("/announcement");
                const data = res.data;

                // console.log(data);

                setAnnouncements({
                    loading: false,
                    announcements: data,
                });
            } catch (error) {
                console.error("Error fetching announcement", error.response);
            }
        }

        fetchAnnouncements();
    }, [isChange]);

    // Filtering function
    const [lessons, setLessons] = useState([]);
    const [filteredLessons, setFilteredLessons] = useState({
        loading: true,
        filteredLessons: [],
    });

    const [subjects, setSubjects] = useState([]);
    const [levels, setLevels] = useState([]);
    const [days] = useState([
        { id: 0, name: "Sunday" },
        { id: 1, name: "Monday" },
        { id: 2, name: "Tuesday" },
        { id: 3, name: "Wednesday" },
        { id: 4, name: "Thursday" },
        { id: 5, name: "Friday" },
        { id: 6, name: "Saturday" },
    ]);

    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedDay, setSelectedDay] = useState("");

    // Fetch lessons on component mount
    useEffect(() => {
        async function fetchLessons() {
            try {
                const res = await axiosClient.get("/lessons");
                const data = res.data.lessons;

                setLessons(data);
                setFilteredLessons({
                    loading: false,
                    filteredLessons: data,
                });

                // console.log(data);

                // Extract unique subjects and levels
                const uniqueSubjects = [
                    ...new Map(
                        data.map((item) => [item.subject_id, item.subject_name])
                    ).values(),
                ];
                const uniqueLevels = [
                    ...new Map(
                        data.map((item) => [
                            item.subject.level_id,
                            item.level_name,
                        ])
                    ).values(),
                ];

                setSubjects(uniqueSubjects);
                setLevels(uniqueLevels);
            } catch (error) {
                console.error("Error fetching lessons", error);
                setFilteredLessons({
                    loading: false,
                    filteredLessons: [],
                }); // Ensure loading is turned off even on error
            }
        }
        fetchLessons();
    }, []);

    // Handle filtering logic
    const handleFilter = () => {
        const filteredData = lessons.filter((lesson) => {
            return (
                (!selectedSubject || lesson.subject_id == selectedSubject) &&
                (!selectedLevel || lesson.level_id == selectedLevel) &&
                (!selectedDay || lesson.day == selectedDay)
            );
        });
        setFilteredLessons({
            loading: false,
            filteredLessons: filteredData,
        });
    };

    // Clear filter function
    const clearFilter = () => {
        setSelectedSubject("");
        setSelectedLevel("");
        setSelectedDay("");
        setFilteredLessons({
            loading: false,
            filteredLessons: lessons,
        }); // Reset to all lessons
    };

    // Stores the IDs of the lessons that have been checked.
    const [selectedLessons, setSelectedLessons] = useState([]);

    const [totalParents, setTotalParents] = useState(0);
    // An object where the key is the lesson ID, and the value is the parent count for that lesson
    // To store parent counts for each lesson
    const [parentCounts, setParentCounts] = useState({});

    // Update the selected lessons when a checkbox is toggled
    const handleCheckboxChange = (lessonId) => {
        setSelectedLessons((prevSelected) => {
            if (prevSelected.includes(lessonId)) {
                // Deselect/unchecked the lesson
                // Remove lesson from selected and subtract its parent count
                return prevSelected.filter((id) => id !== lessonId);
            } else {
                // Select/checked the lesson
                // Add lesson to selected
                return [...prevSelected, lessonId];
            }
        });
    };

    // useEffect(() => {
    //     console.log(selectedLessons);
    // }, [selectedLessons]);

    // Update total parents dynamically when selection changes
    useEffect(() => {
        // Calculates the total by summing up the parent counts for the selected lessons
        // If a lesson doesn't have a parent count yet, it defaults to 0
        const total = selectedLessons.reduce((sum, lessonId) => {
            return sum + (parentCounts[lessonId] || 0);
        }, 0);
        setTotalParents(total);
    }, [selectedLessons, parentCounts]);

    // Update the parent count for each lesson
    const updateTotalParents = (lessonId, count) => {
        setParentCounts((prevCounts) => ({
            ...prevCounts,
            [lessonId]: count,
        }));
    };

    // For Lesson Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const lessonsPerPage = 5; // Max 5 lessons per page

    // Calculate the lessons to display on the current page
    const indexOfLastLesson = currentPage * lessonsPerPage;
    const indexOfFirstLesson = indexOfLastLesson - lessonsPerPage;
    const currentLessons = filteredLessons.filteredLessons.slice(
        indexOfFirstLesson,
        indexOfLastLesson
    );

    const totalPages = Math.ceil(
        filteredLessons.filteredLessons.length / lessonsPerPage
    );

    const goToPage = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // For Announcement pagination
    const [announcementPage, setAnnouncementPage] = useState(1); // Current page for announcements
    const announcementsPerPage = 5; // Number of announcements per page

    // Calculate the announcements to display on the current page
    const indexOfLastAnnouncement = announcementPage * announcementsPerPage;
    const indexOfFirstAnnouncement =
        indexOfLastAnnouncement - announcementsPerPage;
    const currentAnnouncements = displayAnnouncements.announcements.slice(
        indexOfFirstAnnouncement,
        indexOfLastAnnouncement
    );

    const totalAnnouncementPages = Math.ceil(
        displayAnnouncements.announcements.length / announcementsPerPage
    );

    const goToAnnouncementPage = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalAnnouncementPages) {
            setAnnouncementPage(pageNumber);
        }
    };

    // Modal for user feedback
    const [modal, setModal] = useState({
        visible: false,
        message: "",
        type: "",
    });

    // Save and sent announcement
    const { token, user } = useStateContext();
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleSendAnnouncement = async () => {
        if (selectedLessons.length === 0) {
            setModal({
                visible: true,
                message: "Please select at least one lesson.",
                type: "error",
            });
            setTimeout(() => {
                setModal({ visible: false, message: "", type: "" });
            }, 3000);
            return;
        }

        if (!message.trim()) {
            setModal({
                visible: true,
                message: "Please enter a message.",
                type: "error",
            });
            setTimeout(() => {
                setModal({ visible: false, message: "", type: "" });
            }, 3000);
            return;
        }

        setIsSending(true);

        try {
            // Attempt to send the announcement
            const sendResponse = await axiosClient.post("/send-announcement", {
                lesson_ids: selectedLessons,
                message: message,
            });

            if (sendResponse.data.status !== "success") {
                throw new Error(sendResponse.data.message);
            }

            // Check if there were any failed numbers
            if (
                sendResponse.data.failed_numbers &&
                sendResponse.data.failed_numbers.length > 0
            ) {
                const failedNumbers =
                    sendResponse.data.failed_numbers.join(", ");
                setModal({
                    visible: true,
                    message: `Failed to send to the following numbers: ${failedNumbers}`,
                    type: "error",
                });
                setTimeout(() => {
                    setModal({ visible: false, message: "", type: "" });
                }, 3000);
                return;
            }

            // Save the announcement only if sending was successful
            const saveResponse = await axiosClient.post("/save-announcement", {
                admin_id: user.id,
                lesson_ids: selectedLessons,
                message: message,
            });

            if (saveResponse.data.status !== "success") {
                throw new Error(saveResponse.data.message);
            }

            setIsChange(!isChange);

            setModal({
                visible: true,
                message: "Announcement sent and saved successfully!",
                type: "success",
            });

            setTimeout(() => {
                setModal({ visible: false, message: "", type: "" });
            }, 3000);

            setMessage("");
        } catch (error) {
            console.error("Error handling announcement:", error);

            setModal({
                visible: true,
                message:
                    error.response?.data?.message ||
                    "An unexpected error occurred.",
                type: "error",
            });

            setTimeout(() => {
                setModal({ visible: false, message: "", type: "" });
            }, 3000);
        } finally {
            setIsSending(false);
        }
    };

    // twilio testing
    // const [phoneNumber, setPhoneNumber] = useState("");
    // const [message, setMessage] = useState("");
    // const [status, setStatus] = useState("");

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setStatus("Sending...");

    //     try {
    //         const response = await axiosClient.post("/send-whatsapp", {
    //             phone_number: phoneNumber,
    //             message: message,
    //         });

    //         if (response.data.success) {
    //             setStatus("Message sent successfully!");
    //         } else {
    //             setStatus("Failed to send message.");
    //         }
    //     } catch (error) {
    //         setStatus(
    //             `Error: ${error.response?.data?.message || error.message}`
    //         );
    //     }
    // };

    return (
        <>
            <div className="page-title">Announcement</div>
            <ContentContainer id="announcement" title="Announcement Board">
                <div className="announcement-list">
                    {displayAnnouncements.loading ? (
                        <div className="loading">Loading...</div>
                    ) : displayAnnouncements.announcements.length > 0 ? (
                        currentAnnouncements.map((announcement) => (
                            <div
                                key={announcement.id}
                                className="item d-flex flex-column gap-3 py-3"
                            >
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="date">
                                        {formatDate(announcement.created_at)}
                                    </div>
                                    <Link
                                        to={`/announcement/${announcement.id}`}
                                    >
                                        <img
                                            src={`/icon/more.png`}
                                            alt="More options"
                                        />
                                    </Link>
                                </div>
                                <div className="message">
                                    {announcement.message}
                                </div>
                                <div className="credits d-flex justify-content-end">
                                    Created by: {announcement.admin_name}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-announcements">
                            No announcements available.
                        </div>
                    )}
                </div>

                {/* Pagination Controls for Announcements */}
                <div className="pagination justify-content-end mt-3">
                    <button
                        className="previous-btn"
                        onClick={() =>
                            goToAnnouncementPage(announcementPage - 1)
                        }
                        disabled={announcementPage === 1}
                    >
                        Previous
                    </button>
                    {[...Array(totalAnnouncementPages)].map((_, index) => (
                        <button
                            key={index}
                            className={
                                announcementPage === index + 1
                                    ? "active page-btn"
                                    : "page-btn"
                            }
                            onClick={() => goToAnnouncementPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        className="next-btn"
                        onClick={() =>
                            goToAnnouncementPage(announcementPage + 1)
                        }
                        disabled={announcementPage === totalAnnouncementPages}
                    >
                        Next
                    </button>
                </div>
            </ContentContainer>
            <ContentContainer
                id="make-announcement"
                title="Make an Announcement"
            >
                <div className="row">
                    <div className="col-lg-6 col-12">
                        <h6>Recipients</h6>
                        <div className="d-flex flex-sm-row flex-column mb-sm-0 gap-2">
                            <select
                                className="form-control"
                                value={selectedSubject}
                                onChange={(e) =>
                                    setSelectedSubject(e.target.value)
                                }
                            >
                                <option value="">All Subjects</option>
                                {subjects.map((subject, index) => (
                                    <option key={index} value={index + 1}>
                                        {subject}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="form-control"
                                value={selectedLevel}
                                onChange={(e) =>
                                    setSelectedLevel(e.target.value)
                                }
                            >
                                <option value="">All Levels</option>
                                {levels.map((level, index) => (
                                    <option key={index} value={index + 1}>
                                        {level}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="form-control"
                                value={selectedDay}
                                onChange={(e) => setSelectedDay(e.target.value)}
                            >
                                <option value="">All Days</option>
                                {days?.map((day) => (
                                    <option key={day.id} value={day.id}>
                                        {day.name}
                                    </option>
                                ))}
                            </select>
                            <Button color="yellow" onClick={handleFilter}>
                                Filter
                            </Button>
                        </div>
                        <div>
                            <div className="d-flex mb-sm-0 mb-3 justify-content-end">
                                <button
                                    onClick={clearFilter}
                                    style={{
                                        border: "none",
                                        background: "transparent",
                                        fontSize: "10px",
                                        fontStyle: "italic",
                                    }}
                                >
                                    Clear Filter
                                </button>
                            </div>

                            {filteredLessons.loading ? (
                                <p>Loading...</p>
                            ) : filteredLessons.filteredLessons.length > 0 ? (
                                <div>
                                    <ul className="p-0">
                                        {currentLessons.map((lesson) => (
                                            <li
                                                key={lesson.id}
                                                className="mb-4 checkbox"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedLessons.includes(
                                                        lesson.id
                                                    )}
                                                    onChange={() =>
                                                        handleCheckboxChange(
                                                            lesson.id
                                                        )
                                                    }
                                                />
                                                {` ${lesson.subject_name}, ${
                                                    lesson.level_name
                                                }, 
                                ${days[lesson.day]?.name || "TBA"}, 
                                ${formatTimeTo12Hour(
                                    lesson.start_time
                                )} - ${formatTimeTo12Hour(lesson.end_time)}`}
                                                <p className="parent-count ms-3">
                                                    <ParentCount
                                                        lessonId={lesson.id}
                                                        updateTotalParents={(
                                                            count
                                                        ) =>
                                                            updateTotalParents(
                                                                lesson.id,
                                                                count
                                                            )
                                                        }
                                                    />
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="pagination justify-content-end">
                                        <button
                                            className="previous-btn"
                                            onClick={() =>
                                                goToPage(currentPage - 1)
                                            }
                                            disabled={currentPage === 1}
                                        >
                                            Previous
                                        </button>
                                        {[...Array(totalPages)].map(
                                            (_, index) => (
                                                <button
                                                    key={index}
                                                    className={
                                                        currentPage ===
                                                        index + 1
                                                            ? "active page-btn"
                                                            : "page-btn"
                                                    }
                                                    onClick={() =>
                                                        goToPage(index + 1)
                                                    }
                                                >
                                                    {index + 1}
                                                </button>
                                            )
                                        )}
                                        <button
                                            className="next-btn"
                                            onClick={() =>
                                                goToPage(currentPage + 1)
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p>No lessons found.</p>
                            )}
                        </div>
                    </div>
                    <div className="col-lg-6 col-12 mt-lg-0 mt-3">
                        <div>
                            <h6>Message</h6>
                            <textarea
                                className="form-control"
                                rows="6"
                                cols="50"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            ></textarea>
                            <div className="d-flex flex-sm-row flex-column justify-content-between mt-3">
                                <p>
                                    Total Recipients:{" "}
                                    <span style={{ color: "#828282" }}>
                                        {totalParents}
                                    </span>
                                </p>
                                <button
                                    type="submit"
                                    className="btn-create mt-sm-0 mt-3"
                                    onClick={handleSendAnnouncement}
                                    disabled={isSending}
                                >
                                    {isSending
                                        ? "Sending..."
                                        : "Send Announcement"}
                                </button>
                            </div>
                        </div>

                        {/* <form onSubmit={handleSubmit}>
                            <div>
                                <label>Phone Number:</label>
                                <input
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(e) =>
                                        setPhoneNumber(e.target.value)
                                    }
                                    placeholder="Enter recipient's number"
                                    required
                                />
                            </div>
                            <div>
                                <label>Message:</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Enter your message"
                                    required
                                />
                            </div>
                            <button type="submit">Send Message</button>
                        </form>
                        {status && <p>{status}</p>} */}
                    </div>
                </div>
            </ContentContainer>

            {modal.visible && (
                <div className={`modal-feedback ${modal.type}`}>
                    <p>{modal.message}</p>
                </div>
            )}
        </>
    );
}
