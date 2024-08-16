import { useStateContext } from "../contexts/ContextProvider";
import { Navigate, Outlet } from "react-router-dom";
import "../css/GuestLayout.css";

export default function GuestLayout() {
    const { token } = useStateContext();

    if (token) {
        return <Navigate to="/" />;
    }

    return (
        <div className="guest-layout">
            <div className="logo">LOGO</div>
            <div>
                <Outlet />
            </div>
        </div>
    );
}
