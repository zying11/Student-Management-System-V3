<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use App\Models\Student;
use Illuminate\Http\Request;
use App\Models\Teacher;

class FeedbackController extends Controller
{
    public function fetchAllStudents()
    {
        // Define all months
        $months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];

        // Fetch all students with their enrollments and subjects
        $students = Student::with(['enrollments.subject', 'feedback.subject'])->get();

        // Loop through all students to ensure feedback exists
        foreach ($students as $student) {
            foreach ($student->enrollments as $enrollment) {
                foreach ($months as $month) {
                    Feedback::firstOrCreate(
                        [
                            'teacher_id' => $enrollment->lesson->teacher_id ?? null,
                            'student_id' => $student->id,
                            'subject_id' => $enrollment->subject->id,
                            'month' => $month,
                        ],
                        [
                            'status' => 0,
                            'review_date' => null,
                            'topics' => json_encode([]),
                        ]
                    );
                }
            }
        }

        // Fetch updated students with feedback
        $studentsWithFeedback = Student::with([
            'feedback.subject', // Eager load feedback and related subject
        ])->get();

        return response()->json($studentsWithFeedback);
    }


    public function fetchTeacherStudents($userId)
    {
        // Fetch the teacher ID based on the logged-in user's ID
        $teacher = Teacher::where('user_id', $userId)->first();

        if (!$teacher) {
            return response()->json(['error' => 'Teacher not found'], 404);
        }

        $teacherId = $teacher->id;

        // Define all months
        $months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];

        // Fetch all students enrolled in lessons taught by the teacher
        $students = Student::with(['enrollments.subject', 'enrollments.lesson'])
            ->whereHas('enrollments.lesson', function ($query) use ($teacherId) {
                $query->where('teacher_id', $teacherId);
            })
            ->get();

        // Ensure feedback exists for all students, subjects, and months
        foreach ($students as $student) {
            foreach ($student->enrollments as $enrollment) {
                // Only create feedback for subjects taught by the logged-in teacher
                if ($enrollment->lesson->teacher_id == $teacherId) {
                    foreach ($months as $month) {
                        Feedback::firstOrCreate(
                            [
                                'teacher_id' => $teacherId,
                                'student_id' => $student->id,
                                'subject_id' => $enrollment->subject->id,
                                'month' => $month,
                            ],
                            [
                                'status' => 0,
                                'review_date' => null,
                                'topics' => json_encode([]),
                            ]
                        );
                    }
                }
            }
        }

        // Fetch updated students with feedback
        $studentsWithFeedback = Student::whereHas('enrollments.lesson', function ($query) use ($teacherId) {
            $query->where('teacher_id', $teacherId);
        })
            ->with([
                'feedback' => function ($query) use ($teacherId) {
                    $query->whereHas('subject', function ($subQuery) use ($teacherId) {
                        $subQuery->where('teacher_id', $teacherId);
                    });
                },
                'feedback.subject', // Eager load the subject data for each feedback
            ])
            ->get();

        return response()->json($studentsWithFeedback);
    }

    // Fetch feedback history for a student
    public function getFeedbackHistory($studentId, $subjectId)
    {
        $feedback = Feedback::where('student_id', $studentId)
            ->where('subject_id', $subjectId)
            ->with('subject')
            ->get();

        return response()->json(['feedback' => $feedback], 200);
    }

    // Update feedback for a student
    public function update(Request $request, $id)
    {
        $feedback = Feedback::findOrFail($id);

        // Validate the incoming request
        $validatedData = $request->validate([
            'status' => 'required|integer|in:0,1,2',
            'review_date' => 'nullable|date',
            'topics' => 'nullable|array',
            'topics.*.topic_name' => 'required|string|max:255',
            'topics.*.competency_level' => 'required|string|in:Needs Improvement,Satisfactory,Proficient,Mastered',
            'topics.*.class_participation' => 'required|numeric|min:1|max:5',
            'topics.*.problem_solving' => 'required|numeric|min:1|max:5',
            'topics.*.assignment_completion' => 'required|numeric|min:1|max:5',
            'topics.*.communication_skills' => 'required|numeric|min:1|max:5',
            'topics.*.behavior_discipline' => 'required|numeric|min:1|max:5',
            'topics.*.effort_motivation' => 'required|numeric|min:1|max:5',
            'topics.*.comment' => 'required|string|max:255',
            'overall_feedback' => 'nullable|string',
            'suggestions' => 'nullable|string',
        ]);

        // Update the feedback record
        $feedback->update([
            'status' => $validatedData['status'],
            'review_date' => $validatedData['review_date'],
            'topics' => $validatedData['topics'], // Topics will be stored as JSON in the DB
            'overall_feedback' => $validatedData['overall_feedback'],
            'suggestions' => $validatedData['suggestions'],
        ]);

        return response()->json(['message' => 'Feedback updated successfully']);
    }

    public function show($id)
    {
        $feedback = Feedback::with(['student', 'subject.studyLevel'])->findOrFail($id);

        return response()->json([
            'id' => $feedback->id,
            'student_name' => $feedback->student->name,
            'subject_name' => $feedback->subject->subject_name,
            'study_level' => $feedback->subject->studyLevel?->level_name,
            'month' => $feedback->month,
            'status' => $feedback->status,
            'review_date' => $feedback->review_date,
            'topics' => $feedback->topics,
            'overall_feedback' => $feedback->overall_feedback,
            'suggestions' => $feedback->suggestions,
        ]);
    }
}
