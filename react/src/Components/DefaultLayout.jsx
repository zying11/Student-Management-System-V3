import axios from "axios";
import { useEffect } from "react";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/ContextProvider";
import { useState } from "react";
import "../css/DefaultLayout.css";

import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/js/bootstrap.min.js";

export default function DefaultLayout() {
    const { user, token, setUser, setToken } = useStateContext();
    if (!token) {
        return <Navigate to="/login" />;
    }

    const onLogout = (ev) => {
        ev.preventDefault();
        axiosClient.get("/logout").then(({}) => {
            setUser(null);
            setToken(null);
        });
    };

    useEffect(() => {
        axiosClient.get("/user").then(({ data }) => {
            setUser(data);
        });
    }, []);

    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div id="defaultLayout">
            <div className="wrapper">
                <aside id="sidebar" className={isCollapsed ? "collapsed" : ""}>
                    <div className="h-100">
                        <div className="sidebar-logo">Hi, {user.name}</div>
                        <ul className="sidebar-nav mb-0 ps-0 ms-0">
                            <li className="sidebar-item">
                                <a href="#" className="sidebar-link">
                                    <i className="bi bi-list-ul"></i>
                                    Dashboard
                                </a>
                            </li>
                            <li className="sidebar-item">
                                <a
                                    href="#"
                                    className="sidebar-link collapsed"
                                    data-bs-target="#students"
                                    data-bs-toggle="collapse"
                                    aria-expanded="false"
                                >
                                    <i class="bi bi-people-fill"></i>
                                    Students
                                </a>
                                <ul
                                    id="students"
                                    className="sidebar-dropdown list-unstyled collapse"
                                    data-bs-parent="#sidebar"
                                >
                                    <li className="sidebar-item">
                                        <a href="#" className="sidebar-link">
                                            Students List
                                        </a>
                                    </li>
                                    <li className="sidebar-item">
                                        <a href="#" className="sidebar-link">
                                            Add Students
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li className="sidebar-item">
                                <a
                                    href="#"
                                    className="sidebar-link collapsed"
                                    data-bs-target="#teachers"
                                    data-bs-toggle="collapse"
                                    aria-expanded="false"
                                >
                                    <i class="bi bi-people-fill"></i>
                                    Teachers
                                </a>
                                <ul
                                    id="teachers"
                                    className="sidebar-dropdown list-unstyled collapse"
                                    data-bs-parent="#sidebar"
                                >
                                    <li className="sidebar-item">
                                        <a href="#" className="sidebar-link">
                                            Teachers List
                                        </a>
                                    </li>
                                    <li className="sidebar-item">
                                        <a href="#" className="sidebar-link">
                                            Add Teacher
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li className="sidebar-item">
                                <a
                                    href="#"
                                    className="sidebar-link collapsed"
                                    data-bs-target="#timetable"
                                    data-bs-toggle="collapse"
                                    aria-expanded="false"
                                >
                                    <i class="bi bi-calendar"></i>
                                    Timetable
                                </a>
                                <ul
                                    id="timetable"
                                    className="sidebar-dropdown list-unstyled collapse"
                                    data-bs-parent="#sidebar"
                                >
                                    <li className="sidebar-item">
                                        <a href="#" className="sidebar-link">
                                            Manage Subject
                                        </a>
                                    </li>
                                    <li className="sidebar-item">
                                        <a href="#" className="sidebar-link">
                                            Manage Room
                                        </a>
                                    </li>
                                    <li className="sidebar-item">
                                        <a href="#" className="sidebar-link">
                                            Manage Teacher
                                        </a>
                                    </li>
                                    <li className="sidebar-item">
                                        <a href="#" className="sidebar-link">
                                            Schedule Timetable
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li className="sidebar-item">
                                <a
                                    href="#"
                                    className="sidebar-link collapsed"
                                    data-bs-target="#payment"
                                    data-bs-toggle="collapse"
                                    aria-expanded="false"
                                >
                                    <i class="bi bi-credit-card"></i>
                                    Payment
                                </a>
                                <ul
                                    id="payment"
                                    className="sidebar-dropdown list-unstyled collapse"
                                    data-bs-parent="#sidebar"
                                >
                                    <li className="sidebar-item">
                                        <a href="#" className="sidebar-link">
                                            Record Payment
                                        </a>
                                    </li>
                                    <li className="sidebar-item">
                                        <a href="#" className="sidebar-link">
                                            Generate Invoice
                                        </a>
                                    </li>
                                    <li className="sidebar-item">
                                        <a href="#" className="sidebar-link">
                                            Payment Status
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li className="sidebar-item">
                                <a href="#" className="sidebar-link">
                                    <i class="bi bi-gear"></i>
                                    Settings
                                </a>
                            </li>
                        </ul>
                        <div className="logout">
                            <a
                                href="#"
                                onClick={onLogout}
                                className="btn btn-outline-danger ms-2"
                            >
                                Logout
                            </a>
                        </div>
                    </div>
                </aside>

                <div className="main">
                    <nav className="navbar navbar-expand px-3">
                        <button
                            className="btn"
                            id="sidebar-toggle"
                            type="button"
                            onClick={toggleSidebar}
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </nav>
                    <Outlet />
                </div>
            </div>
            <div className="container">
                {/* <header className="d-flex justify-content-between align-items-center py-3">
                    <div>Header</div>
                    <div>
                        {user.name}
                        <a
                            href="#"
                            onClick={onLogout}
                            className="btn btn-outline-danger ms-2"
                        >
                            Logout
                        </a>
                    </div>
                </header> */}
            </div>
        </div>
    );
}
