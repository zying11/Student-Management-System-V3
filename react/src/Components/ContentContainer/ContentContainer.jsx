import React from "react";
import "./ContentContainer.css";

export const ContentContainer = ({ title, children }) => {
    return (
        <div className="content-container mt-3">
            <h1 className="content-title">{title}</h1>
            <div className="position-relative content-body mt-4">
                {children}
            </div>
        </div>
    );
};
