import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import ParentCount from "../components/Announcement/ParentCount";
import Button from "../components/Button/Button";
import ConfirmationModal from "../components/Modal/ConfirmationModal";
import axiosClient from "../axiosClient";
import "../css/Announcement.css";

export default function AnnouncementDetail() {
    const { id } = useParams();

    const [displayAnnouncement, setAnnouncement] = useState({
        loading: true,
        announcement: [],
    });

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

        const ampm = hour >= 12 ? "pm" : "am"; // Determine AM or PM
        hour = hour % 12 || 12; // Convert to 12-hour format, 0 becomes 12

        return `${hour}${ampm}`; // Return formatted time
    }

    // Function to format the date
    const formatDate = (dateString) => {
        const options = { day: "numeric", month: "short", year: "numeric" };
        return new Date(dateString).toLocaleDateString("en-GB", options);
    };

    const [totalParents, setTotalParents] = useState(0);
    const [processedLessons, setProcessedLessons] = useState(new Set()); // Track processed lesson IDs

    const updateTotalParents = (lessonId, count) => {
        setProcessedLessons((prevProcessed) => {
            if (!prevProcessed.has(lessonId)) {
                // If the lesson ID hasn't been processed, add it
                setTotalParents((prevTotal) => prevTotal + count);
                return new Set(prevProcessed).add(lessonId);
            }
            return prevProcessed; // If already processed, do nothing
        });
    };

    useEffect(() => {
        async function fetchAnnouncement() {
            try {
                const res = await axiosClient.get(`/announcement/${id}`);
                const data = res.data;
                setAnnouncement({
                    loading: false,
                    announcement: data,
                });
                // console.log(displayAnnouncement);
            } catch (error) {
                console.error("Error fetching announcements", error.response);
            }
        }

        fetchAnnouncement();
    }, [id]);

    const [displayRecipients, setRecipients] = useState({
        loading: true,
        recipients: [],
    });

    useEffect(() => {
        async function fetchLessons() {
            try {
                const res = await axiosClient.get(
                    `/announcement/lessons/${id}`
                );
                const data = res.data.lessons;

                // Filter out lessons where day, start_time, end_time, or room_id is null
                const filteredData = data.filter(
                    (lesson) =>
                        lesson.day !== null &&
                        lesson.start_time !== null &&
                        lesson.end_time !== null &&
                        lesson.room_id !== null
                );

                setRecipients({
                    loading: false,
                    recipients: filteredData,
                });
            } catch (error) {
                console.error("Error fetching recipients:", error);
            }
        }

        fetchLessons();
    }, [id]);

    return (
        <>
            <div className="page-title">Announcement Detail</div>
            <ContentContainer
                id="announcement-detail"
                title="Announcement Detail"
            >
                <div className="message-container mb-sm-5 mb-4">
                    <h5 className="mb-sm-3 mb-2">Message</h5>
                    <p className="message-content">
                        {displayAnnouncement.loading ? (
                            <p>Loading...</p>
                        ) : (
                            displayAnnouncement.announcement[0].message
                        )}
                    </p>
                </div>
                <div className="recipients-container mb-4">
                    <h5 className="mb-sm-3 mb-2">Recipients</h5>
                    <div className="row">
                        {displayRecipients.loading ? (
                            <div>Loading...</div>
                        ) : (
                            displayRecipients.recipients.map((recipient) => (
                                <div
                                    key={recipient.id}
                                    className={`col-${
                                        displayRecipients.recipients.length ===
                                        1
                                            ? "12"
                                            : "6"
                                    } mb-2 d-flex align-items-center gap-4`}
                                >
                                    <div>
                                        <img
                                            width="15"
                                            height="15"
                                            src={`/icon/orange-tick.png`}
                                            alt="Tick"
                                        />
                                    </div>
                                    <div>
                                        <div className="lesson">
                                            {recipient.subject_name},{" "}
                                            {recipient.level_name},{" "}
                                            {daysOfWeek[recipient.day]},{" "}
                                            {formatTimeTo12Hour(
                                                recipient.start_time
                                            )}{" "}
                                            -{" "}
                                            {formatTimeTo12Hour(
                                                recipient.end_time
                                            )}
                                        </div>
                                        <ParentCount
                                            lessonId={recipient.id}
                                            updateTotalParents={(count) =>
                                                updateTotalParents(
                                                    recipient.id,
                                                    count
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="details-container d-flex flex-sm-row flex-column justify-content-between">
                    <p>
                        Total Recipients:{" "}
                        <span style={{ color: "#828282" }}>{totalParents}</span>
                    </p>
                    <p>
                        Created on:{" "}
                        <span style={{ color: "#828282" }}>
                            {displayAnnouncement.loading
                                ? "Loading... "
                                : formatDate(
                                      displayAnnouncement.announcement[0]
                                          .created_at
                                  )}
                        </span>
                    </p>
                    <p>
                        Created by:{" "}
                        <span style={{ color: "#828282" }}>
                            {displayAnnouncement.loading
                                ? "Loading... "
                                : displayAnnouncement.announcement[0]
                                      .admin_name}
                        </span>
                    </p>
                </div>
            </ContentContainer>
        </>
    );
}
