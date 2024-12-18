import React, { useEffect } from "react";
import { useStateContext } from "../contexts/ContextProvider";

export default function TeacherDashboard() {
  // Get the logged-in user from context
    const { user } = useStateContext(); 

    return (
        <div>
            <h1>Teacher Dashboard</h1>
            <p>Welcome, Teacher {user.name || "Teacher"}</p>{" "}
        </div>
    );
}
