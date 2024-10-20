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
                const res = await axiosClient.get(
                    "http://127.0.0.1:8000/api/rooms"
                );
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
            const res = await axiosClient.post(
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
            await axiosClient.delete(
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
            // console.log(displayRoom.rooms);
            // console.log(room);
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
                console.log("Room updated successfully");
            }
            setIsChange(!isChange);
        } catch (error) {
            setError("Error updating room");
            console.error("Error:", error.response.data);
        }
    };

    // // Function to updating room information -> non working function
    // const handleEditRoom = async () => {
    //     e.preventDefault(); // Prevents page refresh
    //     try {
    //         await axiosClient.put(
    //             `/edit-room/${selectedRoomId}`,
    //             updateRoomData
    //         );
    //         setIsChange(!isChange); // Update the state
    //         alert("Room updated successfully");
    //     } catch (error) {
    //         console.error("Error updating room:", error);
    //         alert("Failed to update room.");
    //     }
    // };

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
                      src="http://localhost:8000/icon/edit.png"
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
