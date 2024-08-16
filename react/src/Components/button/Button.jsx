import React from "react";
import "./Button.css";

const Button = ({ onClick, children, color = "purple", ...props }) => {
    const buttonClass =
        color === "yellow"
            ? "btn-create btn-create-yellow"
            : "btn-create btn-create-purple";
    return (
        <button className={buttonClass} onClick={onClick} {...props}>
            {children}
        </button>
    );
};

export default Button;
