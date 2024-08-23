import React, { useState, useEffect } from "react";
import axios from "axios";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import "../css/Timetable.css";

export default function Timetable() {
    // Variable for fetching room data
    const [rooms, setRoom] = useState([]);

    // Fetch room data
    useEffect(() => {
        async function fetchRooms() {
            try {
                const res = await axios.get("http://127.0.0.1:8000/api/rooms");
                // console.log(res.data.rooms);
                setRoom(res.data.rooms);
            } catch (error) {
                console.error("Error fetching rooms:", error);
            }
        }

        fetchRooms();
    }, []);

    // Variable to display unassigned lesson data
    const [unassignedLessons, setUnassignedLessons] = useState([]);

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
    }, []);
    // console.log(unassignedLessons);

    // Store the Draggable instance
    let draggableInstance = null;

    useEffect(() => {
        const containerEl = document.querySelector("#unassigned-container");
        if (containerEl && !draggableInstance) {
            // Check if draggableInstance is not already set
            draggableInstance = new Draggable(containerEl, {
                itemSelector: ".unassigned",
                eventData: (eventEl) => {
                    // lessonId is a constant variable that stores the value of the data-lesson-id
                    // so must make sure .unassigned div has 'data-lesson-id' attribute
                    const lessonId = eventEl.dataset.lessonId;
                    const lesson = unassignedLessons.find(
                        (l) => l.id.toString() === lessonId
                    );
                    if (lesson) {
                        return {
                            id: lesson.id.toString(),
                            title: lesson.subject_name,
                        };
                    } else {
                        // Return a default object to avoid errors
                        return {
                            id: "",
                            title: "Unknown Lesson",
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
                    <select name="roomID">
                        {rooms.map((room) => (
                            <option key={room.id} value={room.id}>
                                {room.room_name}
                            </option>
                        ))}
                    </select>
                </div>
                <FullCalendar
                    id="calendar"
                    className=""
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    // slotMinTime="08:00:00"
                    // slotMaxTime="19:00:00"
                    editable="true"
                    droppable="true"
                />
            </ContentContainer>
        </>
    );
}
