<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CenterProfile;

class CenterProfileController extends Controller
{
    public function index()
    {
        $centerProfiles = CenterProfile::all();
        return response()->json([
            'status' => 200,
            'centerProfile' => $centerProfiles
        ]);
    }

    public function update(Request $request)
    {
        $centerProfile = CenterProfile::find(1);
        $centerProfile->center_name = $request->input('centerName');
        $centerProfile->center_logo = $request->input('centerLogo');
        $centerProfile->center_address = $request->input('centerAddress');
        $centerProfile->postcode = $request->input('postcode');
        $centerProfile->num_rooms = $request->input('numRooms');
        $centerProfile->save();

        return response()->json([
            'status' => 200,
            'message' => 'Profile updated successfully!'
        ]);
    }
}
