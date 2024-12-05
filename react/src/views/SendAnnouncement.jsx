import axiosClient from "../axiosClient";
import { useState } from "react";

function SendAnnouncement({ selectedLessons, parentCounts }) {
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleSendAnnouncement = async () => {
        if (selectedLessons.length === 0) {
            alert("Please select at least one lesson.");
            return;
        }

        if (!message.trim()) {
            alert("Please enter a message.");
            return;
        }

        setIsSending(true);

        try {
            const response = await axiosClient.post("/send-announcement", {
                lessonIds: selectedLessons,
                message: message,
            });

            if (response.data.status === 200) {
                alert("Announcement sent successfully!");
            } else {
                alert("Failed to send the announcement.");
            }
        } catch (error) {
            console.error("Error sending announcement:", error);
            alert("An error occurred while sending the announcement.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <>
            {" "}
            <h6>Message</h6>
            <textarea
                className="form-control"
                rows="6"
                cols="50"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <div>
                <p>
                    Total Recipients: <span>{parentCounts}</span>
                </p>
                <button
                    className="btn btn-primary mt-3"
                    onClick={handleSendAnnouncement}
                    disabled={isSending}
                >
                    {isSending ? "Sending..." : "Send Announcement"}
                </button>
            </div>
        </>
    );
}

export default SendAnnouncement;
