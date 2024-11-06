import React, { useState, useEffect } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axiosClient";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import { Table } from "../components/Table/Table";
import Button from "../components/Button/Button";
import "../css/Attendance.css";
import dayjs from 'dayjs';

export default function LessonReport(){
     // Get current teacher
     const { token, user } = useStateContext();
     const [lessons, setLessons] = useState([]);

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
    
            const ampm = hour >= 12 ? "PM" : "AM"; // Determine AM or PM
            hour = hour % 12 || 12; // Convert to 12-hour format, 0 becomes 12
    
            return `${hour}${ampm}`; // Return formatted time
        }

    useEffect(() => {
        // Step 1: Fetch the teacher record by user.id
        async function fetchTeacher() {
            try {
                const teacherRes = await axiosClient.get(
                    `/teachers/users/${user.id}`

                );
                const teacher = teacherRes.data;

                // Step 2: Fetch lessons after retrieving teacher.id
                fetchLessons(teacher.id);
            } catch (error) {
                console.error("Error fetching teacher:", error);
            }
        }

        async function fetchLessons(teacherId) {
            try {
                const res = await axiosClient.get("/lessons");

                // Step 3: Filter lessons by teacherId
                const filteredLessons = res.data.lessons.filter(
                    (lesson) => lesson.teacher_id === teacherId
                );
                setLessons(filteredLessons);

                if (filteredLessons.length > 0) {
                    const firstLessonId = filteredLessons[0].id;
                    setSelectedLesson(firstLessonId);

                }
            } catch (error) {
                console.error("Error fetching lessons:", error);
            }
        }

        if (user.id) {
            fetchTeacher(); // Fetch the teacher when user.id is available
        }
    }, [user.id]);

    const [selectedLesson, setSelectedLesson] = useState(null);

       // Handle lesson selection
       const handleLessonChange = (e) => {
        const lessonId = e.target.value;
        setSelectedLesson(lessonId);
    };

    const [dateRangeOption, setDateRangeOption] = useState('thisMonth');

    useEffect(() => {
        // Automatically set date ranges based on selected option
        const today = dayjs();
        if (dateRangeOption === 'thisMonth') {
            setStartDate(today.startOf('month').format('YYYY-MM-DD'));
            setEndDate(today.endOf('month').format('YYYY-MM-DD'));
        } else if (dateRangeOption === 'lastMonth') {
            setStartDate(today.subtract(1, 'month').startOf('month').format('YYYY-MM-DD'));
            setEndDate(today.subtract(1, 'month').endOf('month').format('YYYY-MM-DD'));
        } else {
            setStartDate('');
            setEndDate('');
        }
    }, [dateRangeOption]);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [totalClasses, setTotalClasses] = useState(null);

    const fetchTotalClasses = async () => {
        if (selectedLesson && startDate && endDate) {
            try {
                const response = await axiosClient.get(`/lessons/${selectedLesson}/attendance/count`, {
                    params: { start_date: startDate, end_date: endDate }
                });
                setTotalClasses(response.data.totalClasses);
            } catch (error) {
                console.error('Error fetching total classes', error);
            }
        }
    };



    return(<>
    <div className="page-title">Lesson Report</div>
    <ContentContainer title="View Detailed Report">
        <div className="d-flex gap-3">
        <select
            className="form-control"
            value={selectedLesson}
            onChange={handleLessonChange}
        >
        {lessons.map((lesson) => (
            <option key={lesson.id} value={lesson.id}>
                {lesson.level_name} - {lesson.subject_name},{" "}
                {daysOfWeek[lesson.day]}{" "}
                {formatTimeTo12Hour(lesson.start_time)} -{" "}
                {formatTimeTo12Hour(lesson.end_time)}
            </option>
            ))}
        </select>
        <select
                className="form-control"
                value={dateRangeOption}
                onChange={(e) => setDateRangeOption(e.target.value)}
            >
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="custom">Custom Range</option>
            </select>

            {dateRangeOption === 'custom' && (
                <div className="d-flex gap-2">
                    <input
                        type="date"
                        className="form-control"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        placeholder="Start Date"
                    />
                    <input
                        type="date"
                        className="form-control"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        placeholder="End Date"
                    />
                </div>
            )}
            <Button color="yellow" onClick={fetchTotalClasses}>Filter</Button>
        </div>
       
    </ContentContainer>
    <ContentContainer className="lesson-report">
        <div className="d-flex justify-content-between gap-2">
            <div className="box-data p-4">
                <div>Total Classes Held</div>
                <p>{totalClasses !== null ? totalClasses : '-'}</p>
            </div>
            <div className="box-data p-4">
                <div>Total Students</div>
                <p>4</p>
            </div>
            <div className="box-data p-4">
                <div>Average Attendance Rate</div>
                <p>4</p>
            </div>
        </div>
    </ContentContainer>
    </>);
}