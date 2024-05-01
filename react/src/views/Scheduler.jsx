import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";

import { useEffect } from "react";
import "../css/Scheduler.css";

export default function Scheduler() {
    useEffect(() => {
        const containerEl = document.querySelector("#unassigned-container");
        new Draggable(containerEl, {
            itemSelector: ".unassigned",
            eventData: (eventEl) => {
                return {
                    id: "1",
                    title: eventEl.innerText,
                    duration: "01:00",
                };
            },
        });
    }, []);

    return (
        <>
            <div className="d-flex justify-content-between p-4">
                <div>
                    <h3>Classes to be assigned:</h3>
                    <div id="unassigned-container">
                        <div className="unassigned p-2">English Class</div>
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
                        slotMinTime="08:00:00" // Set minimum time to 8am
                        slotMaxTime="18:00:00" // Set maximum time to 6pm (24-hour format)
                        editable="true"
                        droppable="true"
                    />
                </div>
            </div>
        </>
    );
}
