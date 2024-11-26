import React, { useState, useEffect } from "react";
import { ContentContainer } from "../components/ContentContainer/ContentContainer";
import { Link } from "react-router-dom";
import { Table } from "../components/Table/Table";
import Button from "../components/Button/Button";
import ConfirmationModal from "../components/Modal/ConfirmationModal";
import axiosClient from "../axiosClient";
import "../css/Announcement.css";

export default function Announcement() {
    const [displayAnnouncements, setAnnouncements] = useState({
        loading: true,
        announcements: [],
    });

    // Function to format the date
    const formatDate = (dateString) => {
        const options = { day: "numeric", month: "short", year: "numeric" };
        return new Date(dateString).toLocaleDateString("en-GB", options);
    };

    useEffect(() => {
        async function fetchAnnouncements() {
            try {
                const res = await axiosClient.get("/announcement");
                const data = res.data;

                // console.log(data);

                setAnnouncements({
                    loading: false,
                    announcements: data,
                });
            } catch (error) {
                console.error("Error fetching announcement", error.response);
            }
        }

        fetchAnnouncements();
    }, []);

    return (
        <>
            <div className="page-title">Announcement</div>
            <ContentContainer id="announcement" title="Announcement Board">
                <div className="announcement-list">
                    {displayAnnouncements.loading ? (
                        <div className="loading">Loading...</div>
                    ) : displayAnnouncements.announcements.length > 0 ? (
                        displayAnnouncements.announcements.map(
                            (announcement) => (
                                <div
                                    key={announcement.id}
                                    className="item d-flex flex-column gap-3 py-3"
                                >
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="date">
                                            {formatDate(
                                                announcement.created_at
                                            )}
                                        </div>
                                        <Link
                                            to={`/announcement/${announcement.id}`}
                                        >
                                            <img
                                                src={`${window.location.protocol}//${window.location.hostname}:8000/icon/more.png`}
                                                alt="More options"
                                            />
                                        </Link>
                                    </div>
                                    <div className="message">
                                        {announcement.message}
                                    </div>
                                    <div className="credits d-flex justify-content-end">
                                        Created by: {announcement.admin_name}
                                    </div>
                                </div>
                            )
                        )
                    ) : (
                        <div className="no-announcements">
                            No announcements available.
                        </div>
                    )}
                </div>
            </ContentContainer>
        </>
    );
}
