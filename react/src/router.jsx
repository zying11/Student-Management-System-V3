import { createBrowserRouter } from "react-router-dom";
import Login from "./views/Login.jsx";
import DefaultLayout from "./components/DefaultLayout.jsx";
import GuestLayout from "./components/GuestLayout.jsx";
import Users from "./views/Users.jsx";
import UserForm from "./views/UserForm.jsx";
import Scheduler from "./views/Scheduler.jsx";
import Lesson from "./views/Lesson.jsx";
import Invoice from "./views/Invoice.jsx";
import InvoiceForm from "./views/InvoiceForm.jsx";
import InvoiceTemplate from "./views/InvoiceTemplate.jsx";
import Students from "./views/Students.jsx";
import StudentForm from "./views/StudentForm.jsx";
import StudentProfileView from "./views/StudentProfileView.jsx";
import AdminDashboard from "./views/AdminDashboard.jsx";
import AdminProfile from "./views/AdminProfile.jsx";
import Attendance from "./views/Attendance.jsx";
import ForgotPassword from "./views/ForgotPassword.jsx";
import ResetPassword from "./views/ResetPassword.jsx";
import Timetable from "./views/Timetable.jsx";
import Admin from "./views/Admin.jsx";
import AdminForm from "./views/AdminForm.jsx";
import AdminProfileView from "./views/AdminProfileView.jsx";
import Teacher from "./views/Teacher.jsx";
import TeacherForm from "./views/TeacherForm.jsx";
import TeacherProfileView from "./views/TeacherProfileView.jsx";
import Room from "./views/Room.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "/dashboard",
                element: <AdminDashboard />,
            },
            {
                path: "/profile",
                element: <AdminProfile />,
            },
            {
                path: "/users",
                element: <Users />,
            },
            {
                path: "/users/new",
                element: <UserForm key="userCreate" />,
            },
            {
                path: "/users/:id",
                element: <UserForm key="userUpdate" />,
            },
            {
                path: "/timetable",
                element: <Timetable />,
            },
            {
                path: "/timetabletest",
                element: <Scheduler />,
            },
            {
                path: "/room",
                element: <Room />,
            },
            {
                path: "/lesson",
                element: <Lesson />,
            },
            {
                path: "/attendance",
                element: <Attendance />,
            },
            {
                path: "/invoices",
                element: <Invoice />,
            },
            {
                path: "/invoices/new",
                element: <InvoiceForm key="invoiceCreate" />,
            },
            {
                path: "/invoices/:id",
                element: <InvoiceForm key="invoiceUpdate" />,
            },
            // {
            //     path: "/invoiceTemplate",
            //     element: <InvoiceTemplate invoice={exampleInvoice} />,
            // },
            {
                path: "/invoiceTemplate/:id",
                element: <InvoiceTemplate key="invoiceTemplate" />,
            },
            {
                path: "/student",
                element: <Students key="studentList" />,
            },
            {
                path: "/student/create",
                element: <StudentForm isEditing={false} key="studentCreate" />,
            },
            {
                path: "/student/edit/:id",
                element: <StudentForm isEditing={true} key="studentEdit" />,
            },
            // {
            //     path: "/students/new",
            //     element: <StudentForm key="studentCreate" />,
            // },
            // {
            //     path: "/students/:id",
            //     element: <StudentForm key="studentUpdate" />,
            // },
            {
                path: "/student/:id/profile",
                element: <StudentProfileView key="studentProfile" />,
            },
            {
                path: "/admin",
                element: <Admin key="adminList" />,
            },
            {
                path: "/admin/create",
                element: <AdminForm isEditing={false} key="adminCreate" />,
            },
            {
                path: "/admin/edit/:id",
                element: <AdminForm isEditing={true} key="adminEdit" />,
            },
            {
                path: "/admin/:id/profile",
                element: <AdminProfileView key="adminProfile" />,
            },
            {
                path: "/teacher",
                element: <Teacher key="teacherList" />,
            },
            {
                path: "/teacher/create",
                element: <TeacherForm isEditing={false} key="teacherCreate" />,
            },
            {
                path: "/teacher/edit/:id",
                element: <TeacherForm isEditing={true} key="teacherEdit" />,
            },
            {
                path: "/teacher/:id/profile",
                element: <TeacherProfileView key="teacherProfile" />,
            },
        ],
    },

    {
        path: "/",
        element: <GuestLayout />,
        children: [
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />,
            },
            {
                path: "reset-password/:token",
                element: <ResetPassword />,
            },
        ],
    },
]);

export default router;
