import React, { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";

// Menu items for the sidebar
const menuItems = [
    {
        id: "dashboard",
        icon: "dashboard.png",
        title: "Dashboard",
        link: "/dashboard", // No sub-items
    },
    {
        id: "students",
        icon: "students.png",
        title: "Students",
        subItems: [
            { title: "All Students", link: "/student" },
            { title: "Add New Student", link: "/student/create" },
            { title: "Edit Student", link: "" },
            { title: "Student Profile", link: "" },
        ],
    },
    {
        id: "teachers",
        icon: "teachers.png",
        title: "Teachers",
        subItems: [
            { title: "All Teachers", link: "/teacher" },
            { title: "Add New Teacher", link: "/teacher/create" },
            { title: "Edit Teacher", link: "" },
            { title: "Teacher Profile", link: "" },
        ],
    },
    {
        id: "admins",
        icon: "admins.png",
        title: "Admins",
        subItems: [
            { title: "All Admins", link: "/admin" },
            { title: "Add New Admin", link: "/admin/create" },
            { title: "Edit Admin", link: "" },
            { title: "Admin Profile", link: "" },
        ],
    },
    {
        id: "timetable",
        icon: "timetable.png",
        title: "Timetable",
        subItems: [
            { title: "Add New Lesson", link: "/lesson" },
            { title: "Room Timetable", link: "" },
            { title: "Teacher Timetable", link: "" },
            { title: "Schedule Timetable", link: "/timetable" },
        ],
    },
    {
        id: "payment",
        icon: "payment.png",
        title: "Payment",
        subItems: [
            { title: "Student Fees Collection", link: "/invoices" },
            { title: "Add Invoice", link: "/invoices/new" },
            { title: "Edit Invoice", link: "" },
            { title: "Record Payment", link: "" },
            { title: "View Receipt", link: "" },
        ],
    },
    {
        id: "feedback",
        icon: "feedback.png",
        title: "Feedback",
        subItems: [
            { title: "Assessment Feedback", link: "" },
            { title: "View Feedback Progress", link: "" },
            { title: "Add Feedback", link: "" },
        ],
    },
    {
        id: "announcement",
        icon: "announcement.png",
        title: "Announcement",
        link: "",
    },
    {
        id: "settings",
        icon: "settings.png",
        title: "Settings",
        link: "/profile",
    },
];

const SidebarItem = ({ item, activeItem, setActiveItem }) => {
    // State to track the active subItem
    const [activeSubItem, setActiveSubItem] = useState(null);
    // Check if the item has subItems
    const hasSubItems = item.subItems && item.subItems.length > 0;

    if (hasSubItems) {
        return (
            <li className="sidebar-item">
                <a
                    // onClick={() => setActiveItem(item.id)}
                    // className={`sidebar-link ${
                    //     activeItem === item.id ? "active" : ""
                    // }`}
                    className="sidebar-link"
                    data-bs-target={`#${item.id}`}
                    data-bs-toggle="collapse"
                    // aria-expanded={activeItem === item.id}
                >
                    <img
                        className="sidebar-icon"
                        src={`${window.location.protocol}//${window.location.hostname}:8000/icon/${item.icon}`}
                        alt=""
                        width="auto"
                        height="20"
                    />
                    {item.title}
                </a>
                <ul
                    id={item.id}
                    className="sidebar-dropdown list-unstyled collapse"
                    // className={`sidebar-dropdown list-unstyled collapse ${
                    //     activeItem === item.id ? "show" : ""
                    // }`}
                    data-bs-parent="#sidebar"
                >
                    {item.subItems.map((subItem, subKey) => (
                        <li
                            key={subKey}
                            className={`sidebar-inner ${
                                activeSubItem === subKey ? "active" : ""
                            }`}
                        >
                            <Link
                                to={subItem.link}
                                className="sidebar-inner-link"
                                onClick={() => {
                                    setActiveSubItem(subKey);
                                }}
                            >
                                {subItem.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </li>
        );
    } else {
        return (
            <li
                // className={`sidebar-link ${
                //     activeItem === item.id ? "active" : ""
                // }`}
                // onClick={() => setActiveItem(item.id)}
                className="sidebar-link"
            >
                <Link to={item.link} className="sidebar-link">
                    <img
                        className="sidebar-icon"
                        src={`${window.location.protocol}//${window.location.hostname}:8000/icon/${item.icon}`}
                        alt=""
                        width="20"
                        height="20"
                    />
                    {item.title}
                </Link>
            </li>
        );
    }
};

const Sidebar = () => {
    const [activeItem, setActiveItem] = useState(null);

    return (
        <ul id="sidebar" className="sidebar-nav mb-0 ps-0 ms-0">
            {menuItems.map((item) => (
                <SidebarItem
                    key={item.id}
                    item={item}
                    activeItem={activeItem}
                    setActiveItem={setActiveItem}
                />
            ))}
        </ul>
    );
};

export default Sidebar;
