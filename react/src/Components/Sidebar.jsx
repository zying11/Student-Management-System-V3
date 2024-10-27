import React, { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";

// Menu items for the sidebar
const menuItems = [
    {
        id: "dashboard",
        icon: "dashboard.png",
        title: "Dashboard",
        link: "/dashboard", // No sub-items
        roles: ["admin", "teacher"],
    },
    {
        id: "students",
        icon: "students.png",
        title: "Students",
        subItems: [
            {
                title: "All Students",
                link: "/students",
                roles: ["admin", "teacher"],
            },
            {
                title: "Add New Student",
                link: "/student/create",
                roles: ["admin"],
            },
            { title: "Edit Student", link: "", roles: ["admin"] },
            { title: "Student Profile", link: "", roles: ["admin", "teacher"] },
        ],
        roles: ["admin", "teacher"],
    },
    {
        id: "teachers",
        icon: "teachers.png",
        title: "Teachers",
        subItems: [
            {
                title: "All Teachers",
                link: "/teachers",
                roles: ["admin", "teacher"],
            },
            {
                title: "Add New Teacher",
                link: "/teacher/create",
                roles: ["admin"],
            },
            { title: "Edit Teacher", link: "", roles: ["admin"] },
            { title: "Teacher Profile", link: "", roles: ["admin", "teacher"] },
        ],
        roles: ["admin", "teacher"],
    },
    {
        id: "admins",
        icon: "admins.png",
        title: "Admins",
        subItems: [
            { title: "All Admins", link: "/admins", roles: ["admin"] },
            { title: "Add New Admin", link: "/admin/create", roles: ["admin"] },
            { title: "Edit Admin", link: "", roles: ["admin"] },
            { title: "Admin Profile", link: "", roles: ["admin"] },
        ],
        roles: ["admin"],
    },
    {
        id: "timetable",
        icon: "timetable.png",
        title: "Timetable",
        subItems: [
            { title: "Add New Lesson", link: "/lesson", roles: ["admin"] },
            { title: "Room Timetable", link: "/room", roles: ["admin"] },
            { title: "Teacher Timetable", link: "", roles: ["admin"] },
            {
                title: "Schedule Timetable",
                link: "/timetable",
                roles: ["admin", "teacher"],
            },
        ],
        roles: ["admin"],
    },
    {
        id: "attendance",
        icon: "attendance.png",
        title: "Attendance",
        subItems: [
            {
                title: "Mark Attendance",
                link: "/attendance",
                roles: ["teacher"],
            },
            { title: "Attendance Report", link: "", roles: ["teacher"] },
        ],
        roles: ["teacher"],
    },
    {
        id: "payment",
        icon: "payment.png",
        title: "Payment",
        subItems: [
            {
                title: "Student Fees Collection",
                link: "/invoices",
                roles: ["admin"],
            },
            { title: "Add Invoice", link: "/invoice/create", roles: ["admin"] },
            { title: "Edit Invoice", link: "", roles: ["admin"] },
            { title: "Record Payment", link: "", roles: ["admin"] },
            { title: "View Receipt", link: "", roles: ["admin"] },
        ],
        roles: ["admin"],
    },
    {
        id: "feedback",
        icon: "feedback.png",
        title: "Feedback",
        subItems: [
            {
                title: "Assessment Feedback",
                link: "",
                roles: ["admin", "teacher"],
            },
            {
                title: "View Feedback Progress",
                link: "",
                roles: ["admin", "teacher"],
            },
            { title: "Add Feedback", link: "", roles: ["admin", "teacher"] },
        ],
        roles: ["admin", "teacher"],
    },
    {
        id: "announcement",
        icon: "announcement.png",
        title: "Announcement",
        link: "",
        roles: ["admin"],
    },
    {
        id: "settings",
        icon: "settings.png",
        title: "Settings",
        link: "/profile",
        roles: ["admin"],
    },
];

const SidebarItem = ({ item, activeItem, setActiveItem, userRole }) => {
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
                    {item.subItems
                        .filter((subItem) => subItem.roles.includes(userRole)) // Filter sub-items based on role
                        .map((subItem, subKey) => (
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

const Sidebar = ({ userRole }) => {
    const [activeItem, setActiveItem] = useState(null);

    return (
        <ul id="sidebar" className="sidebar-nav mb-0 ps-0 ms-0">
            {menuItems
                .filter((item) => item.roles.includes(userRole)) // Only display items accessible by the user role
                .map((item) => (
                    <SidebarItem
                        key={item.id}
                        item={item}
                        activeItem={activeItem}
                        setActiveItem={setActiveItem}
                        userRole={userRole}
                    />
                ))}
        </ul>
    );
};

export default Sidebar;
