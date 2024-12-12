<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\StudentParent;
use App\Models\Parents;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Twilio\Rest\Client;
use Exception;

class AnnouncementController extends Controller
{
    public function index($id = null)
    {
        // Build the query
        $query = DB::table('announcements')
            ->join('admins', 'announcements.admin_id', '=', 'admins.id')
            ->join('users', 'admins.user_id', '=', 'users.id')
            ->select(
                'announcements.*', // Select all fields from announcements
                'users.name as admin_name' // Select the name from the users table as admin_name
            );

        // If 'id' is provided via the route, filter by the given ID
        if ($id) {
            $query->where('announcements.id', $id);
        }

        // Execute the query
        $announcements = $query->get();

        return response()->json($announcements);
    }

    public function getParentCount($lessonId)
    {
        // Validate that the lesson is linked to the announcement
        // $lessonExists = DB::table('recipients')
        //     ->where('announcement_id', $announcementId)
        //     ->where('lesson_id', $lessonId)
        //     ->exists();

        // if (!$lessonExists) {
        //     return response()->json([
        //         'status' => 404,
        //         'message' => 'Lesson not found for the specified announcement.',
        //     ]);
        // }

        // Fetch all student IDs for this lesson
        $studentIds = DB::table('enrollments')
            ->where('lesson_id', $lessonId)
            ->pluck('student_id');

        // Fetch all parent IDs for these students
        $parentIds = DB::table('student_parent')
            ->whereIn('student_id', $studentIds)
            ->pluck('parent_id');

        // Get unique parent count
        $uniqueParentCount = $parentIds->unique()->count();

        return response()->json([
            'status' => 200,
            'parentCount' => $uniqueParentCount,
        ]);
    }

    // Method to handle form submission and send a WhatsApp message via Twilio
    // function sendAnnouncement(Request $request)
    // {
    //     // Validate the incoming request
    //     $request->validate([
    //         'phone' => 'required|string',
    //         'message' => 'required|string',
    //     ]);

    //     $twilioSid = env('TWILIO_SID');
    //     $twilioAuthToken = env('TWILIO_AUTH_TOKEN');
    //     $twilioWhatsappNumber = 'whatsapp:' . env('TWILIO_WHATSAPP_NUMBER');
    //     $to = 'whatsapp:' . $request->phone;
    //     $message = $request->message;

    //     try {
    //         $client = new Client($twilioSid, $twilioAuthToken);
    //         $twilioMessage = $client->messages->create(
    //             $to,
    //             [
    //                 'from' => $twilioWhatsappNumber,
    //                 'body' => $message,
    //             ]
    //         );

    //         return response()->json([
    //             'status' => 200,
    //             'message' => 'Message sent successfully!',
    //             'sid' => $twilioMessage->sid,
    //         ]);
    //     } catch (Exception $e) {
    //         return response()->json([
    //             'status' => 500,
    //             'message' => 'Error sending message.',
    //             'error' => $e->getMessage(),
    //         ], 500);
    //     }

    // function getParentPhoneNumbers(Request $request)
    // {
    //     $lessonIds = $request->input('lesson_ids', []);

    //     if (empty($lessonIds)) {
    //         return response()->json(['status' => 'error', 'message' => 'No lessons selected.'], 400);
    //     }

    //     try {
    //         // Fetch student IDs for the selected lessons
    //         $studentIds = Enrollment::whereIn('lesson_id', $lessonIds)->pluck('student_id');

    //         // Fetch parent IDs for these students
    //         $parentIds = StudentParent::whereIn('student_id', $studentIds)->pluck('parent_id');

    //         // Fetch parent phone numbers
    //         $parentNumbers = Parents::whereIn('id', $parentIds)
    //             ->pluck('phone_number')
    //             ->unique();

    //         // Format phone numbers with Malaysian country code (+60)
    //         $formattedNumbers = $parentNumbers->map(function ($number) {
    //             return '+60' . ltrim($number, '0'); // Add +60 and remove leading zero
    //         });

    //         return response()->json(['status' => 'success', 'phone_numbers' => $formattedNumbers]);
    //     } catch (Exception $e) {
    //         return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
    //     }
    // }



    function sendAnnouncement(Request $request)
    {
        // Retrieve Twilio credentials
        $twilioSid = env('TWILIO_SID');
        $twilioAuthToken = env('TWILIO_AUTH_TOKEN');
        $twilioWhatsappNumber = 'whatsapp:' . env('TWILIO_WHATSAPP_NUMBER');

        // Get selected lesson IDs and message from the request
        $lessonIds = $request->input('lesson_ids', []);
        $message = $request->input('message');

        if (empty($lessonIds)) {
            return response()->json(['status' => 'error', 'message' => 'No lessons selected.'], 400);
        }

        try {
            // Fetch student IDs for the selected lessons
            $studentIds = Enrollment::whereIn('lesson_id', $lessonIds)->pluck('student_id');

            // Fetch parent IDs for these students
            $parentIds = StudentParent::whereIn('student_id', $studentIds)->pluck('parent_id');

            // Fetch parent phone numbers
            $parentNumbers = Parents::whereIn('id', $parentIds)
                ->pluck('phone_number')
                ->unique();

            // Format phone numbers with Malaysian country code (+60)
            $formattedNumbers = $parentNumbers->map(function ($number) {
                return 'whatsapp:+60' . ltrim($number, '0'); // Add +60 and remove leading zero
            });

            // Initialize Twilio client
            $client = new Client($twilioSid, $twilioAuthToken);

            // Send the message to all parents
            foreach ($formattedNumbers as $to) {
                $client->messages->create($to, [
                    'from' => $twilioWhatsappNumber,
                    'body' => $message,
                ]);
            }

            return response()->json(['status' => 'success', 'message' => 'Messages sent successfully.']);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }



    }
}



