import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/ContextProvider";
import { useState } from "react";

function SendAnnouncement({ selectedLessons, parentCounts }) {
    const { token, user } = useStateContext();
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
            const response = await axiosClient.post("/save-announcement", {
                admin_id: user.id,
                lesson_ids: selectedLessons,
                message: message,
            });

            if (response.data.status === "success") {
                console.log("Attendance saved successfully!");
            } else {
                alert(
                    "Failed to save the announcement: " + response.data.message
                );
            }
            setMessage("");
        } catch (error) {
            console.error("Error saving announcement:", error);
            alert(
                "An error occurred while saving the announcement in the database."
            );
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
            <div className="d-flex flex-sm-row flex-column justify-content-between mt-3">
                <p>
                    Total Recipients:{" "}
                    <span style={{ color: "#828282" }}>{parentCounts}</span>
                </p>
                <button
                    type="submit"
                    className="btn-create mt-sm-0 mt-3"
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
