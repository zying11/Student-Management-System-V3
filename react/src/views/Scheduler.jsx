import React, { useState, useEffect } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import "../css/Scheduler.css";

export default function Scheduler() {
    // To display unassigned lesson data
    const [unassignedLessons, setUnassignedLessons] = useState([]);
    // Store the Draggable instance
    let draggableInstance = null;

    // To store subjects data
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        // Fetch unassigned lessons and subjects data
        fetchUnassignedLessons();
        fetchSubjects();
    }, []);

    const fetchUnassignedLessons = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/lessons"
            );
            const data = response.data;
            if (Array.isArray(data.lessons)) {
                // Filter out lessons where day, start_time, or end_time is null
                const filteredLessons = data.lessons.filter(
                    (lesson) =>
                        lesson.day == null &&
                        lesson.start_time == null &&
                        lesson.end_time == null
                );
                setUnassignedLessons(filteredLessons);
                console.log(filteredLessons);
            } else {
                console.error("Fetched data is not an array:", data);
            }
        } catch (error) {
            console.error("Error fetching unassigned lessons:", error);
        }
    };

    const fetchSubjects = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/subjects"
            );
            setSubjects(response.data.subjects);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        }
    };

    useEffect(() => {
        const containerEl = document.querySelector("#unassigned-container");
        if (containerEl && !draggableInstance) {
            // Check if draggableInstance is not already set
            draggableInstance = new Draggable(containerEl, {
                itemSelector: ".unassigned",
                eventData: (eventEl) => {
                    const lessonId = eventEl.dataset.lessonId;
                    const lesson = unassignedLessons.find(
                        (l) => l.id.toString() === lessonId
                    );
                    if (lesson) {
                        // Find the subject name from the subjects table
                        const subject = subjects.find(
                            (subject) => subject.id === lesson.subject_id
                        );
                        console.log(lesson.duration);
                        return {
                            id: lesson.id.toString(),
                            title: subject
                                ? subject.subject_name
                                : "Unknown Subject",
                            // duration: 3,
                        };
                    } else {
                        // Return null for invalid lesson IDs
                        return null;
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
    }, [unassignedLessons]);

    const renderUnassignedLessons = () => {
        return unassignedLessons.map((lesson) => (
            <div
                key={lesson.id}
                className="unassigned p-2 mb-2"
                data-lesson-id={lesson.id}
            >
                {/* Display subject name based on subject ID */}
                <p>
                    {
                        subjects.find(
                            (subject) => subject.id === lesson.subject_id
                        )?.subject_name
                    }
                </p>
                <p>Duration: {lesson.duration}</p>
                <p>Capacity: {lesson.capacity}</p>
            </div>
        ));
    };

    // To save lesson (event) that is drop in the calendar to database
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleEventDrop = (eventInfo) => {
        // Get lesson ID from data attribute
        const lessonId = eventInfo.draggedEl.dataset.lessonId;

        // Find corresponding lesson in unassigned lessons
        const lesson = unassignedLessons.find(
            (l) => l.id.toString() === lessonId
        );

        if (!lesson) {
            console.error("Lesson not found for dropped event.");
            return;
        }

        // Validate eventInfo and dateStr
        if (!eventInfo || !eventInfo.dateStr) {
            console.error("Invalid eventInfo or dateStr.");
            return;
        }

        // Parse duration (assuming duration is in hours)
        const duration = parseFloat(lesson.duration);

        // Calculate end time based on duration
        const startTime = new Date(eventInfo.dateStr);
        const endTime = new Date(
            startTime.getTime() + duration * 60 * 60 * 1000
        ); // Add duration in milliseconds

        // Extract day of week (0-6, where 0 is Sunday)
        const dayOfWeek = startTime.getDay();

        // Extract HH:mm format for start and end time
        const startTimeString = startTime.toTimeString().slice(0, 5);
        const endTimeString = endTime.toTimeString().slice(0, 5);

        // Construct transformed event object
        const transformedEvent = {
            id: lessonId, // Get lesson id in the db table instead of id of the event in FullCalendar
            day: dayOfWeek,
            startTime: startTimeString,
            endTime: endTimeString,
        };

        setSelectedEvent(transformedEvent);

        // const dateObj = new Date(eventInfo.dateStr);
        // // Extract day of week (0-6, where 0 is Sunday)
        // const dayOfWeek = dateObj.getDay();
        // // Extract HH:mm format for start time
        // const startTime = dateObj.toTimeString().slice(0, 5);

        // // Adding 1 hour to get end time -> need to change to extract duration field from data
        // dateObj.setHours(dateObj.getHours() + 1);
        // // Extract HH:mm format for end time
        // const endTime = dateObj.toTimeString().slice(0, 5);
        // console.log(endTime);
        // const transformedEvent = {
        //     // Get lesson id in the db table instead of id of the event in FullCalendar
        //     id: lessonId,
        //     day: dayOfWeek,
        //     startTime: startTime,
        //     endTime: endTime,
        // };
        // setSelectedEvent(transformedEvent);
    };

    // When 'save timetable' button is clicked
    const handleSaveTimetable = async () => {
        try {
            // Send selected event data to backend to save in database
            const response = await axios.post(
                "http://127.0.0.1:8000/api/update-lesson",
                selectedEvent
            );
            console.log("Event saved to database:", response.data);
        } catch (error) {
            console.error("Error saving event to database:", error.response);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/lessons");
            const data = await response.json();
            const filteredEvents = data.lessons.filter(
                (event) => event.day && event.start_time && event.end_time
            );

            const parsedEvents = parseEventData(filteredEvents);
            setSelectedEvent(parsedEvents);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    const parseEventData = (data) => {
        // Implement parsing logic if your event data format needs adjustments
        return data.map((event) => ({
            id: event.id,
            title: event.subject_name,
            dayOfWeek: event.day,
            start: event.start_time,
            end: event.end_time,
        }));
    };

    return (
        <>
            <div className="d-flex justify-content-between p-4">
                <div>
                    <h3>Classes to be assigned:</h3>
                    <div id="unassigned-container">
                        {renderUnassignedLessons()}
                    </div>
                </div>
                <div className="w-50 h-100">
                    <FullCalendar
                        id="calendar"
                        plugins={[
                            dayGridPlugin,
                            timeGridPlugin,
                            interactionPlugin,
                        ]}
                        initialView="timeGridWeek"
                        slotMinTime="08:00:00"
                        slotMaxTime="18:00:00"
                        editable="true"
                        droppable="true"
                        drop={handleEventDrop}
                        events={selectedEvent}
                    />
                </div>
            </div>
            <div className="d-flex justify-content-end p-4">
                <button
                    className="btn btn-primary btn-save"
                    onClick={handleSaveTimetable}
                >
                    Save Timetable
                </button>
            </div>
        </>
    );
}
