import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

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
            // { title: "Edit Student", link: "", roles: ["admin"] },
            // { title: "Student Profile", link: "", roles: ["admin", "teacher"] },
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
            // { title: "Edit Teacher", link: "", roles: ["admin"] },
            // { title: "Teacher Profile", link: "", roles: ["admin", "teacher"] },
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
            // { title: "Edit Admin", link: "", roles: ["admin"] },
            // { title: "Admin Profile", link: "", roles: ["admin"] },
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
            {
                title: "Teacher Timetable",
                link: "/teachers/timetable",
                roles: ["admin"],
            },
            {
                title: "Schedule Timetable",
                link: "/timetable",
                roles: ["admin"],
            },
        ],
        roles: ["admin"],
    },
    {
        id: "teacher-timetable",
        icon: "timetable.png",
        title: "Timetable",
        link: "/teacher/timetable", // No sub-items
        roles: ["teacher"],
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
            {
                title: "Attendance Report",
                link: "/attendance-report",
                roles: ["teacher"],
            },
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
            // { title: "Edit Invoice", link: "", roles: ["admin"] },
            {
                title: "Record Payment",
                link: "/record-payments",
                roles: ["admin"],
            },
            // { title: "View Receipt", link: "", roles: ["admin"] },
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
                link: "/assessment-feedback",
                roles: ["admin", "teacher"],
            },
            // {
            //     title: "View Feedback Progress",
            //     link: "/assessment-feedback/history",
            //     roles: ["admin", "teacher"],
            // },
            // { title: "Add Feedback", link: "", roles: ["admin", "teacher"] },
        ],
        roles: ["admin", "teacher"],
    },
    {
        id: "announcement",
        icon: "announcement.png",
        title: "Announcement",
        link: "/announcement",
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

const SidebarItem = ({
    item,
    activeItem,
    setActiveItem,
    activeSubItem,
    setActiveSubItem,
    userRole,
}) => {
    const location = useLocation();
    const hasSubItems = item.subItems && item.subItems.length > 0;

    useEffect(() => {
        if (hasSubItems) {
            const activeSub = item.subItems.findIndex(
                (subItem) => location.pathname === subItem.link
            );
            if (activeSub !== -1) {
                setActiveItem(item.id);
                setActiveSubItem(activeSub);
            }
        } else if (location.pathname === item.link) {
            setActiveItem(item.id);
            setActiveSubItem(null);
        }
    }, [location.pathname, item, setActiveItem, setActiveSubItem, hasSubItems]);

    const handleItemClick = () => {
        if (hasSubItems) {
            setActiveItem(activeItem === item.id ? null : item.id);
        } else {
            setActiveItem(item.id);
            setActiveSubItem(null);
        }
    };

    if (hasSubItems) {
        return (
            <li className="sidebar-item">
                <a
                    className={`sidebar-link ${
                        activeItem === item.id ? "active" : ""
                    }`}
                    onClick={handleItemClick}
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
                    className={`sidebar-dropdown list-unstyled ${
                        activeItem === item.id ? "show" : "collapse"
                    }`}
                >
                    {item.subItems
                        .filter((subItem) => subItem.roles.includes(userRole))
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
                                    onClick={() => setActiveSubItem(subKey)}
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
            <li className="sidebar-item">
                <Link
                    to={item.link}
                    className={`sidebar-link ${
                        activeItem === item.id ? "active" : ""
                    }`}
                    onClick={handleItemClick}
                >
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
    const [activeSubItem, setActiveSubItem] = useState(null);

    return (
        <ul id="sidebar" className="sidebar-nav mb-0 ps-0 ms-0">
            {menuItems
                .filter((item) => item.roles.includes(userRole))
                .map((item) => (
                    <SidebarItem
                        key={item.id}
                        item={item}
                        activeItem={activeItem}
                        setActiveItem={setActiveItem}
                        activeSubItem={activeSubItem}
                        setActiveSubItem={setActiveSubItem}
                        userRole={userRole}
                    />
                ))}
        </ul>
    );
};

export default Sidebar;
