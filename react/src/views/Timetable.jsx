import React, { useState, useEffect } from "react";
import axiosClient from "../axiosClient";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import Button from "../components/Button/Button";
import ConfirmationModal from "../components/Modal/ConfirmationModal";
import "../css/Timetable.css";

export default function Timetable() {
    // Variable for room operation
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [rooms, setRooms] = useState([]);

    const handleRoomChange = (event) => {
        setSelectedRoomId(event.target.value);
        console.log(selectedRoomId);
    };

    const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    // Fetch room data
    useEffect(() => {
        async function fetchRooms() {
            try {
                const res = await axiosClient.get(
                    "http://127.0.0.1:8000/api/rooms"
                );
                const roomsData = res.data.rooms;
                setRooms(roomsData);
                if (roomsData.length > 0) {
                    setSelectedRoomId(roomsData[0].id); // Set the first room's ID as the default
                }
            } catch (error) {
                console.error("Error fetching rooms:", error);
            }
        }

        fetchRooms();
    }, []);

    // Helper function to convert 24-hour time to 12-hour format
    function formatTimeTo12Hour(time) {
        let [hour, minute] = time.split(":"); // Split the time into hour and minute
        hour = parseInt(hour, 10); // Convert hour string to an integer

        const ampm = hour >= 12 ? "pm" : "am"; // Determine AM or PM
        hour = hour % 12 || 12; // Convert to 12-hour format, 0 becomes 12

        return `${hour}${ampm}`; // Return formatted time
    }

    // Variable to display unassigned lesson data
    const [unassignedLessons, setUnassignedLessons] = useState([]);

    // Variable to render component instantly when there is changes
    const [isChange, setIsChange] = useState(false);

    // Display unassigned lesson data
    useEffect(() => {
        async function fetchUnassignedLessons() {
            try {
                const res = await axiosClient.get(
                    "http://127.0.0.1:8000/api/lessons"
                );
                const data = res.data;
                // console.log(data);
                if (Array.isArray(data.lessons)) {
                    // Filter out lessons where day, start_time, or end_time is null
                    const filteredLessons = data.lessons.filter(
                        (lesson) =>
                            lesson.day == null &&
                            lesson.start_time == null &&
                            lesson.end_time == null
                    );
                    setUnassignedLessons(filteredLessons);
                } else {
                    console.error("Fetched data is not an array:", data);
                }
            } catch (error) {
                console.error("Error fetching unassigned lessons:", error);
            }
        }

        fetchUnassignedLessons();
    }, [isChange]);

    // Store the Draggable instance
    let draggableInstance = null;

    const formatDuration = (durationFloat) => {
        // Get the whole number part (hours)
        // Example: If durationFloat is 1.75, Math.floor(1.75) returns 1
        const hours = Math.floor(durationFloat);
        // Calculates the fractional part (minutes)
        // Example: If durationFloat is 1.75 and hours is 1, then 1.75 - 1 gives 0.75
        // The fractional part is multiplied by 60 to convert it into minutes
        const minutes = Math.round((durationFloat - hours) * 60);

        // Ensure two-digit format, String(hours) convert them into string
        // padStart(2, '0'): Ensures the string has at least 2 digits by padding it with leading zeros if necessary
        // Example: If hours is 5, padStart(2, '0') converts it to "05"
        const formattedHours = String(hours).padStart(2, "0");
        const formattedMinutes = String(minutes).padStart(2, "0");

        return `${formattedHours}:${formattedMinutes}`;
    };

    // Draggable div logic
    useEffect(() => {
        const containerEl = document.querySelector("#unassigned-container");
        if (containerEl && !draggableInstance) {
            // Check if draggableInstance is not already set
            draggableInstance = new Draggable(containerEl, {
                itemSelector: ".unassigned",
                eventData: (eventEl) => {
                    // dataset is a read-only property that provides access to all the data attributes defined on that element
                    // Data attributes are custom attributes that start with data-
                    // lessonId is a constant variable that stores the value of the data-lesson-id
                    // so must make sure .unassigned div has 'data-lesson-id' attribute
                    // in this case, is used to find the corresponding lesson from the unassignedLessons array
                    const lessonId = eventEl.dataset.lessonId;
                    // Convert duration to a number
                    const durationFloat = parseFloat(
                        eventEl.dataset.lessonDuration
                    );
                    const lesson = unassignedLessons.find(
                        (l) => l.id.toString() === lessonId
                    );
                    if (lesson) {
                        return {
                            id: lesson.id.toString(),
                            title: lesson.subject_name,
                            duration: formatDuration(durationFloat),
                        };
                    } else {
                        // Return a default object to avoid errors
                        return {
                            id: "",
                            title: "Unknown Lesson",
                            duration: "01:00",
                        };
                    }
                },
            });
        }

        // Clean up the draggable instance to avoid duplication
        return () => {
            if (draggableInstance) {
                draggableInstance.destroy();
                draggableInstance = null;
            }
        };
        // UseEffect Hook will only run whenever the unassignedLessons variable changes
    }, [unassignedLessons]);

    // Variable to fetch all lesson data for clashing detection
    const [lessonData, setLessonData] = useState([]);

    // Fetch lessons data
    useEffect(() => {
        async function fetchLessons() {
            try {
                const res = await axiosClient.get("/timetable-lessons");
                // console.log(res.data.lessons);

                setLessonData(res.data.lessons);
            } catch (error) {
                console.error("Error fetching lessons:", error);
            }
        }

        fetchLessons();
    }, [isChange]); // Dependency array should be an array of dependencies

    // Function to check if two time ranges overlap
    function isTimeClashing(startTime1, endTime1, startTime2, endTime2) {
        // Convert time strings to Date objects for comparison
        const start1 = new Date(`1970-01-01T${startTime1}`);
        const end1 = new Date(`1970-01-01T${endTime1}`);
        const start2 = new Date(`1970-01-01T${startTime2}`);
        const end2 = new Date(`1970-01-01T${endTime2}`);

        // Check if the timings overlap
        return start1 < end2 && start2 < end1;
    }

    // Modal for user feedback
    const [modal, setModal] = useState({
        visible: false,
        message: "",
        type: "",
    });

    // Variable to catch multiple lesson times
    const [selectedEvents, setSelectedEvents] = useState([]);

    // Catch new event start and end time
    const handleEventDrop = (eventInfo) => {
        // Get lesson ID from data attribute
        const lessonId = eventInfo.draggedEl.dataset.lessonId;
        // Get teacher ID from data attribute
        const teacherId = eventInfo.draggedEl.dataset.teacherId;
        // Get lesson duration from data attribute
        const lessonDuration = parseFloat(
            eventInfo.draggedEl.dataset.lessonDuration
        );

        // Validate eventInfo and dateStr
        if (!eventInfo || !eventInfo.dateStr) {
            console.error("Invalid eventInfo or dateStr.");
            return;
        }

        const dateObj = new Date(eventInfo.dateStr);
        // Extract day of week (0-6, where 0 is Sunday)
        const dayOfWeek = dateObj.getDay();
        // Extract HH:mm format for start time
        const startTime = dateObj.toTimeString().slice(0, 5);

        // Convert the duration into hours and minutes
        const hours = Math.floor(lessonDuration);
        const minutes = Math.round((lessonDuration - hours) * 60);

        // Calculate the end time
        dateObj.setHours(dateObj.getHours() + hours);
        dateObj.setMinutes(dateObj.getMinutes() + minutes);

        // Extract HH:mm format for end time
        const endTime = dateObj.toTimeString().slice(0, 5);

        const newEvent = {
            id: lessonId,
            day: dayOfWeek,
            startTime: startTime,
            endTime: endTime,
        };

        console.log(newEvent);

        // Fetch all lessons for the same teacher from the current lessons array
        const teacherLessons = lessonData.filter(
            (lesson) =>
                lesson.teacher_id === parseInt(teacherId) &&
                lesson.day == dayOfWeek
        );

        // console.log(teacherLessons);

        // Check for clashes with existing lessons
        let isClash = false;
        teacherLessons.forEach((lesson) => {
            if (
                isTimeClashing(
                    newEvent.startTime,
                    newEvent.endTime,
                    lesson.start_time,
                    lesson.end_time
                )
            ) {
                isClash = true;
            }
        });

        if (isClash) {
            // alert("Teacher's schedule is clashing with another lesson!");
            setModal({
                visible: true,
                message:
                    "The lesson you are trying to insert clashes with the teacher’s current timetable. Please select another time.",
                type: "error",
            });

            // Hide modal after 3 seconds
            setTimeout(() => {
                setModal({ visible: false, message: "", type: "" });
            }, 3000);

            // Revert the event drop to its original position
            eventInfo.revert();
        } else {
            // If no clash, append the new event to the selectedEvents array
            setSelectedEvents((prevEvents) => [...prevEvents, newEvent]);
            // Proceed with updating the backend, if necessary
        }
    };

    // Catch existing event start and end time
    const handleExistingEventDrop = async (eventInfo) => {
        const { event } = eventInfo; // Extract event data
        const updatedEvent = {
            id: event.id,
            day: event.start.getDay(), // Extract day
            startTime: event.start.toTimeString().slice(0, 5), // Extract start time
            endTime: event.end ? event.end.toTimeString().slice(0, 5) : null, // Extract end time
            roomId: selectedRoomId, // Include room ID
        };
        console.log(updatedEvent);

        // Validate for clashes
        const teacherLessons = lessonData.filter(
            (lesson) =>
                lesson.teacher_id === parseInt(event.teacherId) &&
                lesson.day == updatedEvent.day
        );

        let isClash = false;
        teacherLessons.forEach((lesson) => {
            if (
                isTimeClashing(
                    updatedEvent.startTime,
                    updatedEvent.endTime,
                    lesson.start_time,
                    lesson.end_time
                )
            ) {
                isClash = true;
            }
        });

        if (isClash) {
            setModal({
                visible: true,
                message:
                    "The lesson you are trying to insert clashes with the teacher’s current timetable. Please select another time.",
                type: "error",
            });

            // Hide modal after 3 seconds
            setTimeout(() => {
                setModal({ visible: false, message: "", type: "" });
            }, 3000);

            eventInfo.revert(); // Revert to the original position
        } else {
            // If no clash, append the new event to the selectedEvents array
            setSelectedEvents((prevEvents) => [...prevEvents, updatedEvent]);
            // Hide modal after 3 seconds
            setTimeout(() => {
                setModal({ visible: false, message: "", type: "" });
            }, 3000);
        }
    };

    // Save timetable to the database
    const handleSaveTimetable = async () => {
        // console.log(selectedRoomId); // To check which room is selected
        if (!selectedRoomId) {
            console.error("No room selected.");
            return;
        }

        try {
            // Iterate over each selected event and send it to the backend separately
            for (const event of selectedEvents) {
                const eventData = {
                    ...event,
                    roomId: selectedRoomId, // Include the selected room ID
                };

                const res = await axiosClient.post(
                    "/set-lesson-time",
                    eventData
                );
            }
            // Trigger success modal
            setModal({
                visible: true,
                message: "Timetable Saved successfully!",
                type: "success",
            });
            setIsChange(!isChange);
        } catch (error) {
            console.error("Error", error.response);
            // Trigger error modal
            setModal({
                visible: true,
                message: "There's a problem saving the timetable!",
                type: "error",
            });
        }

        //Hide modal after 3 seconds
        setTimeout(() => {
            setModal({ visible: false, message: "", type: "" });
        }, 3000);
    };

    // Variable to display timetable events
    const [timetableEvents, setTimetableEvents] = useState([]);

    // Format the fetched data into FullCalendar event format
    const formatEventData = (lessons) => {
        return lessons.map((lesson) => {
            // Check for null values and provide fallback defaults
            const startTime = lesson.start_time
                ? lesson.start_time.slice(0, 5)
                : null;
            const endTime = lesson.end_time
                ? lesson.end_time.slice(0, 5)
                : null;
            const dayOfWeek = lesson.day !== null ? parseInt(lesson.day) : null;

            return {
                id: lesson.id.toString(),
                title: lesson.subject?.subject_name || "No Subject",
                teacherId: lesson.teacher?.id || null,
                startTime: startTime,
                endTime: endTime,
                daysOfWeek: dayOfWeek !== null ? [dayOfWeek] : undefined, // Avoid adding undefined days
                extendedProps: {
                    subject: lesson.subject?.subject_name || "No Subject",
                    studyLevel:
                        lesson.subject?.study_level?.level_name || "No Level",
                    teacher: lesson.teacher?.user?.name || "No Teacher",
                    day:
                        dayOfWeek !== null
                            ? daysOfWeek[dayOfWeek]
                            : "Unscheduled",
                    startTime: lesson.start_time || "Unscheduled",
                    endTime: lesson.end_time || "Unscheduled",
                },
            };
        });
    };

    // Fetch events based on the selected room
    useEffect(() => {
        if (selectedRoomId) {
            async function fetchEvents() {
                try {
                    const res = await axiosClient.get(
                        `/timetable-lessons?room_id=${selectedRoomId}`
                    );
                    // console.log(res.data); // To check data format
                    const formattedEvents = formatEventData(res.data.lessons);
                    setTimetableEvents(formattedEvents);
                } catch (error) {
                    console.error("Error fetching events:", error);
                }
            }
            fetchEvents();
        }
    }, [selectedRoomId, isChange]);

    // Reschedule
    const handleReschedule = async (eventId) => {
        try {
            const res = await axiosClient.post("/reschedule-lesson", {
                lesson_id: eventId,
            });

            if (res.status == 200) {
                // To update the ui state
                setIsChange(!isChange);
                setIsModalOpen(false);
            }

            // Update frontend state based on the response
            const updatedLesson = res.data.lesson;
            setSelectedEvents((prevEvents) =>
                prevEvents.map((event) =>
                    event.id === eventId
                        ? {
                              ...event,
                              day: updatedLesson.day,
                              startTime: updatedLesson.start_time,
                              endTime: updatedLesson.end_time,
                              roomId: updatedLesson.room_id,
                          }
                        : event
                )
            );

            // Provide feedback to the user
            setModal({
                visible: true,
                message:
                    "Lesson reset successfully. You can now reschedule it.",
                type: "success",
            });

            setTimeout(() => {
                setModal({ visible: false, message: "", type: "" });
            }, 3000);
        } catch (error) {
            console.error(error);

            // Display error feedback to the user
            setModal({
                visible: true,
                message: "Failed to reset the lesson. Please try again.",
                type: "error",
            });

            setTimeout(() => {
                setModal({ visible: false, message: "", type: "" });
            }, 3000);
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleEventClick = (clickInfo) => {
        const { extendedProps } = clickInfo.event;

        if (
            !extendedProps.day ||
            !extendedProps.startTime ||
            !extendedProps.endTime
        ) {
            console.warn("Incomplete lesson data:", extendedProps);
            setModal({
                visible: true,
                message:
                    "This lesson is unscheduled and cannot be interacted with.",
                type: "error",
            });
            setTimeout(() => {
                setModal({ visible: false, message: "", type: "" });
            }, 3000);
            return;
        }

        setSelectedEvent(clickInfo.event);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    // Media query for calendar
    const [isLargeScreen, setIsLargeScreen] = useState(
        window.innerWidth > 1024
    );

    // Detect screen size change
    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth > 1024);
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            <div className="page-title">Timetable</div>
            <ContentContainer title="List of Unassigned Lessons">
                <div
                    id="unassigned-container"
                    className="position-relative d-flex gap-4 mt-3 flex-wrap"
                >
                    {unassignedLessons.map((lesson) => (
                        <div
                            className="unassigned"
                            data-lesson-id={lesson.id}
                            data-teacher-id={lesson.teacher_id}
                            data-lesson-duration={lesson.duration}
                            key={lesson.id}
                        >
                            <div className="subject-name">
                                {lesson.subject_name}
                            </div>
                            <p className="level-name">{lesson.level_name}</p>
                            <p className="teacher-name">{lesson.name}</p>
                        </div>
                    ))}
                </div>
            </ContentContainer>
            <ContentContainer title="Timetable">
                <div className="room-selection d-flex justify-content-end my-3">
                    <select
                        className="room-select"
                        name="roomID"
                        value={selectedRoomId || ""}
                        onChange={handleRoomChange}
                    >
                        {rooms.map((room) => (
                            <option key={room.id} value={room.id}>
                                {room.room_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="calendar-container">
                    {isLargeScreen ? (
                        <FullCalendar
                            id="calendar"
                            className=""
                            plugins={[
                                dayGridPlugin,
                                timeGridPlugin,
                                interactionPlugin,
                            ]}
                            initialView="timeGridWeek"
                            slotMinTime="08:00:00"
                            slotMaxTime="19:00:00"
                            editable={true}
                            droppable={true}
                            eventReceive={(info) => {
                                // Remove or hide the dragged element after drop
                                const draggableElement = document.querySelector(
                                    `[data-lesson-id="${info.event.id}"]`
                                );

                                if (draggableElement) {
                                    // Option 1: Hide the element
                                    draggableElement.style.display = "none";

                                    // Option 2: Remove the element entirely
                                    // draggableElement.remove();
                                }
                            }}
                            drop={handleEventDrop}
                            eventDrop={handleExistingEventDrop}
                            events={timetableEvents}
                            eventClick={handleEventClick}
                            eventBackgroundColor="#E9FFEE"
                            eventBorderColor="#0CB631"
                            eventTextColor="#006A37"
                            eventOverlap={false}
                            eventDurationEditable={true}
                            eventResizableFromStart={false}
                            allDaySlot={false}
                        />
                    ) : (
                        <p>
                            Screen size is too small. Please switch to a bigger
                            screen size to view the calender.
                        </p>
                    )}
                </div>

                <div className="d-flex justify-content-lg-end justify-content-center mt-4">
                    <Button
                        data-bs-toggle="modal"
                        data-bs-target="#confirmationModal"
                        color="yellow"
                    >
                        Save Timetable
                    </Button>
                </div>
            </ContentContainer>

            {isModalOpen && selectedEvent && (
                <div className="modal-overlay">
                    <div className="modal-details">
                        <button
                            className="close-btn btn-close d-flex align-items-center justify-content-center"
                            onClick={closeModal}
                        >
                            ×
                        </button>
                        <div className="modal-header p-3">
                            <h5>Lesson Details</h5>
                        </div>
                        <div className="p-3">
                            <p className="mb-3">
                                <strong>Subject:</strong>{" "}
                                {selectedEvent.extendedProps.subject}
                            </p>
                            <p className="mb-3">
                                <strong>Level:</strong>{" "}
                                {selectedEvent.extendedProps.studyLevel}
                            </p>
                            <p className="mb-3">
                                <strong>Teacher:</strong>{" "}
                                {selectedEvent.extendedProps.teacher}
                            </p>
                            <p className="mb-3">
                                <strong>Day:</strong>{" "}
                                {selectedEvent.extendedProps.day}
                            </p>
                            <p>
                                <strong>Time:</strong>{" "}
                                {formatTimeTo12Hour(
                                    selectedEvent.extendedProps.startTime
                                )}{" "}
                                -{" "}
                                {formatTimeTo12Hour(
                                    selectedEvent.extendedProps.endTime
                                )}
                            </p>
                            <div className="d-flex justify-content-center mt-3">
                                <Button
                                    color="yellow"
                                    onClick={() =>
                                        handleReschedule(selectedEvent.id)
                                    }
                                >
                                    Reschedule
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {modal.visible && (
                <div className={`modal-feedback ${modal.type}`}>
                    <p>{modal.message}</p>
                </div>
            )}

            <ConfirmationModal
                id="confirmationModal"
                icon="tick.png"
                headerText="Save timetable?"
                bodyText="Are you sure you want to save this timetable?"
                onConfirm={handleSaveTimetable}
            />
        </>
    );
}
