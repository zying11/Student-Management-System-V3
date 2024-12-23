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

export default function AllTeacherTimetable() {
    // Variables for teacher operation
    const [selectedTeacherId, setSelectedTeacherId] = useState(null);
    const [teachers, setTeachers] = useState([]);

    const handleTeacherChange = (event) => {
        setSelectedTeacherId(event.target.value);
        console.log(selectedTeacherId);
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

    // Fetch teacher data
    useEffect(() => {
        async function fetchTeachers() {
            try {
                const res = await axiosClient.get("/teachers");
                console.log(res);
                const teachersData = res.data.data;
                setTeachers(teachersData);
                if (teachersData.length > 0) {
                    setSelectedTeacherId(teachersData[0].id); // Set the first teacher's ID as the default
                }
            } catch (error) {
                console.error("Error fetching teachers:", error);
            }
        }

        fetchTeachers();
    }, []);

    // Helper function to convert 24-hour time to 12-hour format
    function formatTimeTo12Hour(time) {
        let [hour, minute] = time.split(":");
        hour = parseInt(hour, 10);

        const ampm = hour >= 12 ? "pm" : "am";
        hour = hour % 12 || 12;

        return `${hour}${ampm}`;
    }

    // Variable to display timetable events
    const [timetableEvents, setTimetableEvents] = useState([]);

    // Format the fetched data into FullCalendar event format
    const formatEventData = (lessons) => {
        return lessons.map((lesson) => {
            // Check if start_time and end_time are not null or undefined
            const startTime = lesson.start_time
                ? lesson.start_time.slice(0, 5)
                : null;
            const endTime = lesson.end_time
                ? lesson.end_time.slice(0, 5)
                : null;

            // Check if room is available, otherwise default to "-"
            const roomName =
                lesson.room && lesson.room.room_name
                    ? lesson.room.room_name
                    : "-";

            return {
                id: lesson.id.toString(),
                title: lesson.subject.subject_name,
                startTime: startTime,
                endTime: endTime,
                daysOfWeek: [parseInt(lesson.day)],
                extendedProps: {
                    subject: lesson.subject.subject_name,
                    studyLevel: lesson.subject.study_level.level_name,
                    teacher: lesson.teacher.user.name,
                    day: daysOfWeek[lesson.day],
                    startTime: lesson.start_time,
                    endTime: lesson.end_time,
                    room: roomName,
                },
            };
        });
    };

    // Fetch events based on the selected teacher
    useEffect(() => {
        if (selectedTeacherId) {
            async function fetchEvents() {
                try {
                    const res = await axiosClient.get(
                        `/teachers-timetable?teacher_id=${selectedTeacherId}`
                    );
                    console.log(res);
                    const formattedEvents = formatEventData(res.data.lessons);
                    setTimetableEvents(formattedEvents);
                } catch (error) {
                    console.error("Error fetching events:", error);
                }
            }
            fetchEvents();
        }
    }, [selectedTeacherId]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleEventClick = (clickInfo) => {
        setSelectedEvent(clickInfo.event);
        console.log(clickInfo.event);

        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    return (
        <>
            <ContentContainer title="Teachers Timetable">
                <div className="teacher-selection d-flex justify-content-end my-3">
                    <select
                        className="room-select"
                        value={selectedTeacherId || ""}
                        onChange={handleTeacherChange}
                    >
                        {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                                {teacher.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="calendar-container">
                    <FullCalendar
                        id="calendar"
                        plugins={[
                            dayGridPlugin,
                            timeGridPlugin,
                            interactionPlugin,
                        ]}
                        initialView="timeGridWeek"
                        slotMinTime="08:00:00"
                        slotMaxTime="19:00:00"
                        events={timetableEvents}
                        eventClick={handleEventClick}
                        eventBackgroundColor="#E9FFEE"
                        eventBorderColor="#0CB631"
                        eventTextColor="#006A37"
                        eventOverlap={false}
                        eventDurationEditable={false}
                        eventResizableFromStart={false}
                        allDaySlot={false}
                    />
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
                            <p className="mb-3">
                                <strong>Time:</strong>{" "}
                                {formatTimeTo12Hour(
                                    selectedEvent.extendedProps.startTime
                                )}{" "}
                                -{" "}
                                {formatTimeTo12Hour(
                                    selectedEvent.extendedProps.endTime
                                )}
                            </p>
                            <p className="mb-3">
                                <strong>Room:</strong>{" "}
                                {selectedEvent.extendedProps.room}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
