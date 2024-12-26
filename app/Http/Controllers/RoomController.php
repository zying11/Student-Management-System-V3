<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index()
    {
        $rooms = Room::all();
        return response()->json([
            'status' => 200,
            'rooms' => $rooms,
        ]);
    }

    public function addNewRoom(Request $request)
    {
        // Create a new Lesson instance and save to the database
        $room = new Room();
        $room->room_name = $request->input('roomName');
        $room->capacity = $request->input('roomCapacity');
        $room->save();

        return response()->json([
            'status' => 200,
            'message' => 'Room added successfully'
        ]);
    }

    public function getRoom($id)
    {
        $room = Room::find($id);
        if ($room) {
            return response()->json($room);
        } else {
            return response()->json(['message' => 'Room not found'], status: 404);
        }
    }

    public function updateRoom(Request $request, $id)
    {
        $room = Room::find($id);
        if ($room) {
            $room->room_name = $request->input('roomName');
            $room->capacity = $request->input('roomCapacity');
            $room->save();
            return response()->json(['status' => 200, 'message' => 'Room updated successfully']);
        } else {
            return response()->json(['message' => 'Room not found'], 404);
        }
    }

    public function deleteRoom($id)
    {
        $room = Room::find($id);

        if ($room) {
            $room->delete();
            return response()->json(['message' => 'Room deleted successfully'], status: 200);
        } else {
            return response()->json(['message' => 'Room not found'], 404);
        }
    }

}
