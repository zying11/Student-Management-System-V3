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
        $centerProfile = CenterProfile::find(1); // Find the profile by ID

        // Update text fields
        $centerProfile->center_name = $request->input('centerName');
        $centerProfile->address = $request->input('address');
        $centerProfile->postcode = $request->input('postcode');
        $centerProfile->city = $request->input('city');
        $centerProfile->state = $request->input('state');

        // Handle the logo upload if a file is provided
        if ($request->hasFile('centerLogo')) {
            // Validate the file
            $request->validate([
                'centerLogo' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            // Get the file and generate a unique name
            $file = $request->file('centerLogo');
            $fileName = time() . '.' . $file->getClientOriginalExtension();

            // Move the file to the public/images/ directory
            $file->move(public_path('profile'), $fileName);

            // Save the file name to the database
            $centerProfile->center_logo = $fileName;
        }

        // Save the updated profile data
        $centerProfile->save();

        return response()->json([
            'status' => 200,
            'message' => 'Center profile updated successfully!',
            'logo_url' => asset('profile/' . $centerProfile->center_logo), // Return the new logo URL
        ]);
    }


}
