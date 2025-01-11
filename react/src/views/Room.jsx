import React, { useState, useEffect } from "react";
import axiosClient from "../axiosClient";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import { Table } from "../components/Table/Table";
import Button from "../components/Button/Button";
import ConfirmationModal from "../components/Modal/ConfirmationModal";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";

// import "../css/Timetable.css";

export default function Room() {
    // Modal for user feedback
    const [modal, setModal] = useState({
        visible: false,
        message: "",
        type: "",
    });

    const handleInput = (setterFunction) => (e) => {
        // Destructure name and value from the event target (the input element that triggered the change)
        const { name, value } = e.target;

        // Update data state
        setterFunction((prevData) => ({
            // Spread the previous state to retain all existing values
            ...prevData,
            // Update the property that matches the input's name attribute
            [name]: value,
        }));
    };

    // Variable for fetching room data
    const [displayRoom, setDisplayRoom] = useState({
        rooms: [],
        loading: true,
    });

    // Variable to update table instantly
    const [isChange, setIsChange] = useState(false);

    // Fetch rooms data
    useEffect(() => {
        async function fetchRooms() {
            try {
                const res = await axiosClient.get("/rooms");
                console.log(res.data.rooms);

                setDisplayRoom({
                    rooms: res.data.rooms,
                    loading: false,
                });
            } catch (error) {
                console.error("Error fetching rooms:", error);
            }
        }

        fetchRooms();
    }, [isChange]); // Dependency array should be an array of dependencies

    // Variable to add new data
    const [roomData, setRoomData] = useState({
        roomName: "",
        roomCapacity: "",
    });

    // Post lessons data
    const addRoom = async (e) => {
        e.preventDefault();

        // Simple validation for required fields
        if (!roomData.roomName || !roomData.roomCapacity) {
            setError("Please fill in all fields");
            return;
        }

        try {
            const res = await axiosClient.post("/add-room", roomData);
            // console.log(res.data);
            if (res.status === 200) {
                setModal({
                    visible: true,
                    message: "Room added successfully!",
                    type: "success",
                });
            }
        } catch (error) {
            console.error("Error:", error.response.data); //use err.response.data to display more info about the err
            setModal({
                visible: true,
                message: "There's a problem adding the room.",
                type: "error",
            });
        }

        setIsChange(!isChange);

        setTimeout(() => {
            setModal({ visible: false, message: "", type: "" });
        }, 3000);

        // Clear the form and error message
        setRoomData({
            roomName: "",
            roomCapacity: "",
        });
        setError("");
    };

    const [selectedRoomId, setSelectedRoomId] = useState(null);

    // Function to handle deletion of the room
    const handleDeleteRoom = async () => {
        try {
            const res = await axiosClient.delete(`/rooms/${selectedRoomId}`);
            // Re-fetch room data to update the table after deletion
            setIsChange(!isChange);
            if (res.status === 200) {
                setModal({
                    visible: true,
                    message: "Room deleted successfully!",
                    type: "success",
                });
            }
        } catch (error) {
            console.error("Error deleting room:", error);
            setModal({
                visible: true,
                message: "There's a problem deleting the room",
                type: "error",
            });
        }

        setTimeout(() => {
            setModal({ visible: false, message: "", type: "" });
        }, 3000);
    };

    // Variable to update data
    const [updateRoomData, setUpdateRoomData] = useState({
        roomName: "",
        roomCapacity: "",
    });

    // Update this effect to search for the room when selectedSubjectId changes
    useEffect(() => {
        console.log(selectedRoomId);
        if (selectedRoomId) {
            const room = displayRoom.rooms.find(
                (room) => room.id === selectedRoomId
            );
            console.log(displayRoom.rooms);
            console.log(room);
            // Set to current room data for posting edited room purposes
            setUpdateRoomData({
                roomName: room.room_name,
                roomCapacity: room.capacity,
            });
        }
    }, [selectedRoomId]);

    // Edit subject -> working function
    const editRoom = async (e) => {
        e.preventDefault();

        try {
            const res = await axiosClient.put(
                `/edit-room/${selectedRoomId}`,
                updateRoomData
            );
            if (res.status === 200) {
                setModal({
                    visible: true,
                    message: "Room updated successfully!",
                    type: "success",
                });
            }
            setIsChange(!isChange);
        } catch (error) {
            console.error("Error:", error.response.data);
            setModal({
                visible: true,
                message: "There's a problem deleting the room.",
                type: "error",
            });
        }

        setTimeout(() => {
            setModal({ visible: false, message: "", type: "" });
        }, 3000);
    };

    const [timetableRoomId, setTimetableRoomId] = useState(null);
    const [rooms, setRooms] = useState([]);

    // Displaying calendar
    const handleRoomChange = (event) => {
        setTimetableRoomId(event.target.value);
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

    // Helper function to convert 24-hour time to 12-hour format
    function formatTimeTo12Hour(time) {
        let [hour, minute] = time.split(":"); // Split the time into hour and minute
        hour = parseInt(hour, 10); // Convert hour string to an integer

        const ampm = hour >= 12 ? "pm" : "am"; // Determine AM or PM
        hour = hour % 12 || 12; // Convert to 12-hour format, 0 becomes 12

        return `${hour}${ampm}`; // Return formatted time
    }

    // Fetch room data
    useEffect(() => {
        async function fetchRooms() {
            try {
                const res = await axiosClient.get("/rooms");
                const roomsData = res.data.rooms;
                setRooms(roomsData);
                if (roomsData.length > 0) {
                    setTimetableRoomId(roomsData[0].id); // Set the first room's ID as the default
                }
            } catch (error) {
                console.error("Error fetching rooms:", error);
            }
        }

        fetchRooms();
    }, [isChange]);

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
        if (timetableRoomId) {
            async function fetchEvents() {
                try {
                    const res = await axiosClient.get(
                        `/timetable-lessons?room_id=${timetableRoomId}`
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
    }, [timetableRoomId, isChange]);

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

    // Error handling
    const [error, setError] = useState("");

    const tableHeader = ["ID", "Room", "Max Capacity", "Actions"];

    const tableData = displayRoom.loading
        ? [
              [
                  <td colSpan="8">
                      <div className="d-flex justify-content-center align-items-center loader-container">
                          <div>Loading</div>
                      </div>
                  </td>,
              ],
          ]
        : displayRoom.rooms.map((room) => [
              room.id,
              room.room_name || "-",
              room.capacity || "-",
              <div className="actions">
                  <img
                      className="me-sm-2 me-0 mb-2 mb-sm-0"
                      src="/icon/edit.png"
                      alt="Edit"
                      data-bs-toggle="modal"
                      data-bs-target="#editRoomModal"
                      onClick={() => {
                          setSelectedRoomId(room.id);
                      }}
                      style={{ cursor: "pointer" }}
                  />
                  <img
                      className="me-sm-2 me-0 mb-2 mb-sm-0"
                      src="/icon/delete.png"
                      alt="Delete"
                      data-bs-toggle="modal"
                      data-bs-target="#confirmationModal"
                      onClick={() => {
                          setSelectedRoomId(room.id);
                      }}
                      style={{ cursor: "pointer" }}
                  />
              </div>,
          ]);
    return (
        <>
            <div className="page-title">Room</div>
            <div className="d-flex justify-content-end">
                <Button
                    data-bs-toggle="modal"
                    data-bs-target="#createRoomModal"
                >
                    Add Room
                </Button>
            </div>
            <ContentContainer title="Rooms">
                <Table
                    header={tableHeader}
                    data={tableData}
                    itemsPerPage={5}
                ></Table>
            </ContentContainer>

            <ContentContainer title="Room Timetable">
                <div className="room-selection d-flex justify-content-end my-3">
                    <select
                        className="room-select"
                        name="roomID"
                        value={timetableRoomId || ""}
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
            </ContentContainer>

            <div
                id="editRoomModal"
                className="modal fade"
                tabindex="-1"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Edit a Room</h5>
                            <button
                                type="button"
                                class="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        {error && (
                            <div className="alert alert-danger">{error}</div>
                        )}
                        <form className="p-3" onSubmit={editRoom}>
                            {/* Room Name */}
                            <div className="mb-3">
                                <label className="form-label">Room Name</label>
                                <input
                                    type="text"
                                    name="roomName"
                                    onChange={handleInput(setUpdateRoomData)}
                                    value={updateRoomData.roomName}
                                    className="form-control"
                                    required
                                />
                            </div>

                            {/* Room Name */}
                            <div className="mb-3">
                                <label className="form-label">
                                    Max Capacity
                                </label>
                                <input
                                    type="number"
                                    step="1"
                                    name="roomCapacity"
                                    onChange={handleInput(setUpdateRoomData)}
                                    value={updateRoomData.roomCapacity}
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="button-container d-flex justify-content-end gap-3">
                                <Button color="yellow" data-bs-dismiss="modal">
                                    Save
                                </Button>
                                <Button data-bs-dismiss="modal">Cancel</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div
                id="createRoomModal"
                className="modal fade lesson-modal"
                tabindex="-1"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Create a Room</h5>
                            <button
                                type="button"
                                class="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        {error && (
                            <div className="alert alert-danger">{error}</div>
                        )}
                        <form className="p-3" method="post" onSubmit={addRoom}>
                            {/* Room Name */}
                            <div className="mb-3">
                                <label className="form-label">Room Name</label>
                                <input
                                    type="text"
                                    name="roomName"
                                    onChange={handleInput(setRoomData)}
                                    value={roomData.roomName}
                                    className="form-control"
                                    placeholder="Enter room name"
                                    required
                                />
                            </div>

                            {/* Room Name */}
                            <div className="mb-3">
                                <label className="form-label">
                                    Max Capacity
                                </label>
                                <input
                                    type="number"
                                    step="1"
                                    name="roomCapacity"
                                    onChange={handleInput(setRoomData)}
                                    value={roomData.roomCapacity}
                                    className="form-control"
                                    placeholder="Enter max capacity"
                                    required
                                />
                            </div>

                            <div className="button-container d-flex justify-content-end gap-3">
                                <Button color="yellow" data-bs-dismiss="modal">
                                    Create
                                </Button>
                                <Button data-bs-dismiss="modal">Cancel</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

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
                headerText="Delete Room?"
                bodyText="Are you sure you want to delete this room?"
                onConfirm={handleDeleteRoom}
            />
        </>
    );
}
