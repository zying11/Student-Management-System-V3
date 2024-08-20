import { useStateContext } from "../contexts/ContextProvider";
import { Navigate, Outlet } from "react-router-dom";
import "../css/GuestLayout.css";

export default function GuestLayout() {
    const { token } = useStateContext();

    if (token) {
        return <Navigate to="/" />;
    }

    return (
        <div className="guest-layout-container">
            <header className="guest-header w-100 p-4">
                <h3 className="logo-text">LOGO</h3>
            </header>

            <div className="guest-main-content">
                <Outlet />
            </div>
        </div>
    );
}
