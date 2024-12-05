<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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


}

