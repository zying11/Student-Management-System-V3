<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\StudentParent;
use App\Models\Parents;
use App\Models\Enrollment;
use App\Models\Recipient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Twilio\Rest\Client;
use Twilio\Exceptions\TwilioException;
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

    //Testing
    public function sendMessage(Request $request)
    {
        $validated = $request->validate([
            'phone_number' => 'required|string',
            'message' => 'required|string',
        ]);

        $sid = env('TWILIO_SID');
        $token = env('TWILIO_AUTH_TOKEN');
        $from = 'whatsapp:' . env('TWILIO_WHATSAPP_NUMBER'); // Your Twilio WhatsApp number

        try {
            $client = new Client($sid, $token);

            $client->messages->create(
                'whatsapp:' . $validated['phone_number'], // Recipient's WhatsApp number
                [
                    'from' => $from,
                    'body' => $validated['message'],
                ]
            );

            return response()->json(['success' => true, 'message' => 'Message sent successfully']);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function sendAnnouncement(Request $request)
    {
        // $twilioSid = env('TWILIO_SID');
        // $twilioAuthToken = env('TWILIO_AUTH_TOKEN');
        // $twilioWhatsappNumber = 'whatsapp:' . env('TWILIO_WHATSAPP_NUMBER');

        $twilioSid = 'ACefabc9f6f231264ddcce027801ba3a10';
        $twilioAuthToken = '2a98c77f297c94f9467d2ffeb0fb7988';
        $twilioWhatsappNumber = '+14155238886';


        // Log::info('Twilio Env Variables', [
        //     'TWILIO_SID' => env('TWILIO_SID'),
        //     'TWILIO_AUTH_TOKEN' => env('TWILIO_AUTH_TOKEN'),
        //     'TWILIO_WHATSAPP_NUMBER' => env('TWILIO_WHATSAPP_NUMBER'),
        // ]);

        $lessonIds = $request->input('lesson_ids', []);
        $message = $request->input('message');

        if (empty($lessonIds)) {
            return response()->json(['status' => 'error', 'message' => 'No lessons selected.'], 400);
        }

        try {
            // Get parent phone numbers from the database
            $studentIds = Enrollment::whereIn('lesson_id', $lessonIds)->pluck('student_id');
            $parentIds = StudentParent::whereIn('student_id', $studentIds)->pluck('parent_id');
            $parentNumbers = Parents::whereIn('id', $parentIds)
                ->pluck('phone_number')
                ->unique();

            // Format the phone numbers for WhatsApp
            $formattedNumbers = $parentNumbers->map(function ($number) {
                return 'whatsapp:+60' . ltrim($number, '0');
            });

            $client = new Client($twilioSid, $twilioAuthToken);


            $failedNumbers = [];
            foreach ($formattedNumbers as $to) {
                try {
                    // Send message via Twilio
                    $messageResponse = $client->messages->create($to, [
                        'from' => $twilioWhatsappNumber,
                        'body' => $message,
                    ]);

                    // Check for failure in message response, you can also log this response for debugging
                    if ($messageResponse->status == 'failed') {
                        $failedNumbers[] = $to;
                    }
                } catch (TwilioException $e) {
                    // Catch Twilio exceptions and log errors for each failed number
                    Log::error('Twilio Error: Failed to send WhatsApp message', [
                        'error' => $e->getMessage(),
                        'number' => $to,
                    ]);
                    $failedNumbers[] = $to;
                } catch (Exception $e) {
                    // Catch any other errors and log
                    Log::error('General Error: Failed to send WhatsApp message', [
                        'error' => $e->getMessage(),
                        'number' => $to,
                    ]);
                    $failedNumbers[] = $to;
                }
            }

            // Check if any numbers failed to receive the message
            if (!empty($failedNumbers)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Failed to send messages to some recipients.',
                    'failed_numbers' => $failedNumbers,
                ], 400);
            }

            // Return success if all messages sent successfully
            return response()->json(['status' => 'success', 'message' => 'Messages sent successfully.']);
        } catch (Exception $e) {
            // Log and handle any unexpected errors
            Log::error('Error sending announcements', [
                'error' => $e->getMessage(),
                'lesson_ids' => $lessonIds,
            ]);
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function saveAnnouncement(Request $request)
    {
        $validatedData = $request->validate([
            'lesson_ids' => 'required|array',
            'lesson_ids.*' => 'exists:lessons,id',
            'message' => 'required|string',
            'admin_id' => 'required',
        ]);

        try {

            // Create the announcement
            $announcement = Announcement::create([
                'admin_id' => $validatedData['admin_id'],
                'message' => $validatedData['message'],
            ]);

            // Attach recipients
            $recipients = [];
            foreach ($validatedData['lesson_ids'] as $lessonId) {
                $recipients[] = [
                    'announcement_id' => $announcement->id,
                    'lesson_id' => $lessonId,
                ];
            }

            Recipient::insert($recipients);

            return response()->json([
                'status' => 'success',
                'message' => 'Announcement saved successfully!',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to send announcement. ' . $e->getMessage(),
            ], 500);
        }
    }

}



