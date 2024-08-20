import React from "react";
import "./ContentContainer.css";

export const ContentContainer = ({ title, children }) => {
    return (
        <div className="content-container mt-3">
            <div className="content-title mb-3">{title}</div>
            <div className="content-body">{children}</div>
        </div>
    );
};
