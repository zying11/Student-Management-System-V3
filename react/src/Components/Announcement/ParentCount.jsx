import React, { useState, useEffect } from "react";
import axiosClient from "../../axiosClient";

function ParentCount({ lessonId, updateTotalParents }) {
    const [parentCount, setParentCount] = useState(null);

    useEffect(() => {
        async function fetchParentCount() {
            try {
                const res = await axiosClient.get(
                    `/announcement/parents/${lessonId}`
                );
                setParentCount(res.data.parentCount);
                // Update the total parent count in the parent component
                updateTotalParents(res.data.parentCount);
            } catch (error) {
                console.error("Error fetching parent count:", error);
            }
        }

        fetchParentCount();
    }, [lessonId]);

    return <p className="parents">{parentCount ?? "Loading..."} parents</p>;
}

export default ParentCount;
