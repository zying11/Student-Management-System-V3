import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/ContextProvider";
import { useState } from "react";
import Sidebar from "./Sidebar";
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

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 769);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 769) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        };

        // Add event listener for window resize
        window.addEventListener("resize", handleResize);

        // Clean up the event listener on component unmount
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div id="defaultLayout">
            <div className="wrapper">
                <aside id="sidebar" className={isCollapsed ? "collapsed" : ""}>
                    <div className="h-100">
                        <div className="sidebar-logo">LOGO</div>
                        <Sidebar />
                    </div>
                </aside>

                <div
                    className={
                        isCollapsed
                            ? "stretched position-relative main mb-4"
                            : "position-relative main mb-4"
                    }
                >
                    <nav className="navbar navbar-expand justify-content-between">
                        <button
                            className="btn"
                            id="sidebar-toggle"
                            type="button"
                            onClick={toggleSidebar}
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="logout">
                            <a
                                href="#"
                                onClick={onLogout}
                                className="btn btn-outline-danger"
                            >
                                Logout
                            </a>
                        </div>
                    </nav>
                    <div className="px-md-3 px-2 mt-xl-5 mt-3">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}
