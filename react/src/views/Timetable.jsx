import React, { useState, useEffect } from "react";
import axios from "axios";
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

    // Fetch room data
    useEffect(() => {
        async function fetchRooms() {
            try {
                const res = await axios.get("http://127.0.0.1:8000/api/rooms");
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

    // Variable to display unassigned lesson data
    const [unassignedLessons, setUnassignedLessons] = useState([]);

    // Variable to render component instantly when there is changes
    const [isChange, setIsChange] = useState(false);

    // Display unassigned lesson data
    useEffect(() => {
        async function fetchUnassignedLessons() {
            try {
                const res = await axios.get(
                    "http://127.0.0.1:8000/api/lessons"
                );
                const data = res.data;
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

    // Variable to catch multiple lesson times
    const [selectedEvents, setSelectedEvents] = useState([]);

    // Catch event start and end time
    const handleEventDrop = (eventInfo) => {
        // Get lesson ID from data attribute
        const lessonId = eventInfo.draggedEl.dataset.lessonId;
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

        // Append the new event to the selectedEvents array
        setSelectedEvents((prevEvents) => [...prevEvents, newEvent]);
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

                const res = await axios.post(
                    "http://127.0.0.1:8000/api/set-lesson-time",
                    eventData
                );
                console.log("Saved successfully!");
            }

            setIsChange(!isChange);
        } catch (error) {
            console.error("Error", error.response);
        }
    };

    // Variable to display timetable events
    const [timetableEvents, setTimetableEvents] = useState([]);

    // Format the fetched data into FullCalendar event format
    const formatEventData = (lessons) => {
        return lessons.map((lesson) => {
            const startTime = lesson.start_time.slice(0, 5); // Extract HH:mm format
            const endTime = lesson.end_time.slice(0, 5); // Extract HH:mm format

            return {
                id: lesson.id.toString(),
                title: lesson.subject.subject_name,
                startTime: startTime,
                endTime: endTime,
                daysOfWeek: [parseInt(lesson.day)], // Set the day of the week (0-6)
            };
        });
    };

    // Fetch events based on the selected room
    useEffect(() => {
        if (selectedRoomId) {
            async function fetchEvents() {
                try {
                    const res = await axios.get(
                        `http://127.0.0.1:8000/api/timetable-lessons?room_id=${selectedRoomId}`
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
    }, [selectedRoomId]);

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
                            data-lesson-duration={lesson.duration}
                            key={lesson.id}
                        >
                            <div className="subject-name mb-2">
                                {lesson.subject_name}
                            </div>
                            <p>{lesson.level_name}</p>
                            {/* <p>{lesson.teacher_name}</p> */}
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
                        events={timetableEvents}
                        eventBackgroundColor="#E9FFEE"
                        eventBorderColor="#0CB631"
                        eventTextColor="#006A37"
                        eventOverlap={false}
                        eventDurationEditable={false}
                        eventResizableFromStart={false}
                        allDaySlot={false}
                    />
                </div>

                <div className="d-flex justify-content-end mt-4">
                    <Button
                        data-bs-toggle="modal"
                        data-bs-target="#confirmationModal"
                        color="yellow"
                    >
                        Save Timetable
                    </Button>
                </div>
            </ContentContainer>

            <div
                className="modal fade"
                id="alertModal"
                tabIndex="-1"
                aria-labelledby="alertModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body">
                            Timetable saved successfully!
                        </div>
                    </div>
                </div>
            </div>

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
