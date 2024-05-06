import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import "../css/Scheduler.css";

export default function Scheduler() {
    const [unassignedLessons, setUnassignedLessons] = useState([]);
    // Store the Draggable instance
    let draggableInstance = null;

    useEffect(() => {
        fetchUnassignedLessons();
    }, []);

    const fetchUnassignedLessons = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/lessons");
            const data = await response.json();
            console.log("Fetched data:", data); // Check fetched data
            if (Array.isArray(data.lessons)) {
                setUnassignedLessons(data.lessons); // Update state if data is an array
            } else {
                console.error("Fetched data is not an array:", data);
            }
            console.log(data.lessons);
        } catch (error) {
            console.error("Error fetching unassigned lessons:", error);
            d;
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
                    return lesson
                        ? {
                              // Check if lesson exists
                              id: lesson.id.toString(),
                              title: lesson.subject_name,
                              duration: lesson.duration,
                          }
                        : null; // Return null for invalid lesson IDs
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
                className="unassigned p-2"
                data-lesson-id={lesson.id}
            >
                <p>{lesson.subject_name}</p>
                <p>Duration: {lesson.duration}</p>
                <p>Capacity: {lesson.capacity}</p>
            </div>
        ));
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
                    />
                </div>
            </div>
        </>
    );
}
