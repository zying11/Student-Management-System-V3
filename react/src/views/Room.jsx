import React, { useState, useEffect } from "react";
import axios from "axios";
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
                const res = await axios.get("http://127.0.0.1:8000/api/rooms");
                // console.log(res.data.rooms);

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

    // Variable for posting room data
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
            const res = await axios.post(
                "http://127.0.0.1:8000/api/add-room",
                roomData
            );
            // console.log(res.data);
            console.log("Room added successfully!");
        } catch (error) {
            console.error("Error:", error.response.data); //use err.response.data to display more info about the err
        }

        setIsChange(!isChange);

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
            await axios.delete(
                `http://127.0.0.1:8000/api/rooms/${selectedRoomId}`
            );
            // Re-fetch room data to update the table after deletion
            setIsChange(!isChange);
            alert("Room deleted successfully");
        } catch (error) {
            console.error("Error deleting room:", error);
            alert("Failed to delete room.");
        }
    };

    // Fetch the data of the selected room to edit
    const fetchRoomData = async (roomId) => {
        try {
            const res = await axios.get(
                `http://127.0.0.1:8000/api/get-room/${roomId}`
            );
            // setRoomData(res.data);
            // console.log(roomData.roomName);
            console.log(selectedRoomId);
        } catch (error) {
            console.error("Error fetching room data:", error);
        }
    };

    // Function to updating room information
    const handleEditRoom = async () => {
        try {
            await axios.put(
                `http://127.0.0.1:8000/api/edit-room/${selectedRoomId}`,
                roomData
            );
            setIsChange(!isChange); // Update the state
            alert("Room updated successfully");
        } catch (error) {
            console.error("Error updating room:", error);
            alert("Failed to update room.");
        }
    };

    // Error handling
    const [error, setError] = useState("");

    // Handling input changes
    const handleInput = (e) => {
        // Destructure name and value from the event target (the input element that triggered the change)
        const { name, value } = e.target;

        // Update the roomData state
        setRoomData((prevLessonData) => ({
            // Spread the previous state to retain all existing values
            ...prevLessonData,

            // Update the property that matches the input's name attribute
            [name]: value,
        }));
    };

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
                      className="me-2"
                      src="http://localhost:8000/icon/edit.png"
                      alt="Edit"
                      data-bs-toggle="modal"
                      data-bs-target="#editRoomModal"
                      onClick={() => {
                          setSelectedRoomId(room.id);
                          fetchRoomData(room.id); // Fetch room data for editing
                      }}
                      style={{ cursor: "pointer" }}
                  />
                  <img
                      className="me-2"
                      src="http://localhost:8000/icon/delete.png"
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

            <div
                id="editRoomModal"
                className="modal fade lesson-modal"
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
                        <form
                            className="p-3"
                            method="post"
                            onSubmit={handleEditRoom}
                        >
                            {/* Room Name */}
                            <div className="mb-3">
                                <label className="form-label">Room Name</label>
                                <input
                                    type="text"
                                    name="roomName"
                                    onChange={(e) =>
                                        setRoomData({
                                            ...roomData,
                                            capacity: e.target.value,
                                        })
                                    }
                                    value={roomData.roomName}
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
                                    onChange={(e) =>
                                        setRoomData({
                                            ...roomData,
                                            capacity: e.target.value,
                                        })
                                    }
                                    value={roomData.roomCapacity}
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="button-container d-flex justify-content-end gap-3">
                                <Button color="yellow">Save</Button>
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
                                    onChange={handleInput}
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
                                    onChange={handleInput}
                                    value={roomData.roomCapacity}
                                    className="form-control"
                                    placeholder="Enter max capacity"
                                    required
                                />
                            </div>

                            <div className="button-container d-flex justify-content-end gap-3">
                                <Button color="yellow">Create</Button>
                                <Button data-bs-dismiss="modal">Cancel</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

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
