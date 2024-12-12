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
                lesson_ids: selectedLessons,
                message: message,
            });

            if (response.data.status === "success") {
                alert("Announcement sent successfully!");
                setMessage(""); // Clear message input after success
            } else {
                alert(
                    "Failed to send the announcement: " + response.data.message
                );
            }
        } catch (error) {
            console.error("Error sending announcement:", error);
            alert("An error occurred while sending the announcement.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div>
            <h6>Message</h6>
            <textarea
                className="form-control"
                rows="6"
                cols="50"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <div className="d-flex justify-content-between mt-3">
                <p>
                    Total Recipients:{" "}
                    <span style={{ color: "#828282" }}>{parentCounts}</span>
                </p>
                <button
                    type="submit"
                    className="btn-create"
                    onClick={handleSendAnnouncement}
                    disabled={isSending}
                >
                    {isSending ? "Sending..." : "Send Announcement"}
                </button>
            </div>
        </div>
    );
}

export default SendAnnouncement;
