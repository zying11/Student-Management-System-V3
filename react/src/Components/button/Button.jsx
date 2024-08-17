import React from "react";
import "./Button.css";

const Button = ({
    onClick,
    children,
    color = "purple",
    className = "",
    ...props
}) => {
    const buttonClass =
        color === "yellow"
            ? "btn-create btn-create-yellow"
            : "btn-create btn-create-purple";

    return (
        <button
            className={`${buttonClass} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
