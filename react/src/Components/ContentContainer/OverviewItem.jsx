import React from "react";
import "./OverviewItem.css";

const OverviewItem = ({ iconSrc, title, text, lineColor }) => {
    return (
        <div className="overview d-flex flex-fill">
            <div className="d-flex p-3 gap-3">
                <div className="left">
                    <img
                        src={`${window.location.protocol}//${window.location.hostname}:8000/icon/${iconSrc}`}
                        alt={title}
                    />
                </div>
                <div className="right ps-3 d-flex flex-column justify-content-center">
                    <h6 className="mb-0 pb-1">{title}</h6>
                    <p>{text}</p>
                    <div
                        className="line"
                        style={{
                            content: '""',
                            position: "absolute",
                            left: "0",
                            top: "25%",
                            bottom: "25%",
                            width: "1px",
                            backgroundColor: lineColor || "#904dbc", // Dynamically set the line color
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default OverviewItem;
