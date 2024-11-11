// import { createBrowserRouter } from "react-router-dom";
// import ProtectedRoute from "./components/Route/ProtectedRoute.jsx";
// import Login from "./views/Login.jsx";
// import DefaultLayout from "./components/DefaultLayout.jsx";
// import GuestLayout from "./components/GuestLayout.jsx";
// import Users from "./views/Users.jsx";
// import UserForm from "./views/UserForm.jsx";
// import Scheduler from "./views/Scheduler.jsx";
// import Lesson from "./views/Lesson.jsx";
// import Invoice from "./views/Invoice.jsx";
// import InvoiceForm from "./views/InvoiceForm.jsx";
// import InvoiceTemplate from "./views/InvoiceTemplate.jsx";
// import Students from "./views/Students.jsx";
// import StudentForm from "./views/StudentForm.jsx";
// import StudentProfileView from "./views/StudentProfileView.jsx";
// import AdminDashboard from "./views/AdminDashboard.jsx";
// import AdminProfile from "./views/AdminProfile.jsx";
// import Attendance from "./views/Attendance.jsx";
// import ForgotPassword from "./views/ForgotPassword.jsx";
// import ResetPassword from "./views/ResetPassword.jsx";
// import Timetable from "./views/Timetable.jsx";
// import Admin from "./views/Admin.jsx";
// import AdminForm from "./views/AdminForm.jsx";
// import AdminProfileView from "./views/AdminProfileView.jsx";
// import Teacher from "./views/Teacher.jsx";
// import TeacherDashboard from "./views/TeacherDashboard.jsx";
// import TeacherForm from "./views/TeacherForm.jsx";
// import TeacherProfileView from "./views/TeacherProfileView.jsx";
// import Room from "./views/Room.jsx";
// import Unauthorized from "./views/Unauthorized.jsx";
// import { useStateContext } from "./contexts/ContextProvider.jsx";

// const router = createBrowserRouter([
//     {
//         path: "/",
//         element: <DefaultLayout />,
//         children: [
//             {
//                 path: "/dashboard",
//                 element: <AdminDashboard />,
//             },
//             {
//                 path: "/profile",
//                 element: <AdminProfile />,
//             },
//             {
//                 path: "/users",
//                 element: <Users />,
//             },
//             {
//                 path: "/users/new",
//                 element: <UserForm key="userCreate" />,
//             },
//             {
//                 path: "/users/:id",
//                 element: <UserForm key="userUpdate" />,
//             },
//             {
//                 path: "/timetable",
//                 element: <Timetable />,
//             },
//             {
//                 path: "/timetabletest",
//                 element: <Scheduler />,
//             },
//             {
//                 path: "/room",
//                 element: <Room />,
//             },
//             {
//                 path: "/lesson",
//                 element: <Lesson />,
//             },
//             {
//                 path: "/attendance",
//                 element: <Attendance />,
//             },
//             {
//                 path: "/invoices",
//                 element: <Invoice />,
//             },
//             {
//                 path: "/invoices/new",
//                 element: <InvoiceForm key="invoiceCreate" />,
//             },
//             {
//                 path: "/invoices/:id",
//                 element: <InvoiceForm key="invoiceUpdate" />,
//             },
//             // {
//             //     path: "/invoiceTemplate",
//             //     element: <InvoiceTemplate invoice={exampleInvoice} />,
//             // },
//             {
//                 path: "/invoiceTemplate/:id",
//                 element: <InvoiceTemplate key="invoiceTemplate" />,
//             },
//             {
//                 path: "/student",
//                 element: <Students key="studentList" />,
//             },
//             {
//                 path: "/student/create",
//                 element: <StudentForm isEditing={false} key="studentCreate" />,
//             },
//             {
//                 path: "/student/edit/:id",
//                 element: <StudentForm isEditing={true} key="studentEdit" />,
//             },
//             // {
//             //     path: "/students/new",
//             //     element: <StudentForm key="studentCreate" />,
//             // },
//             // {
//             //     path: "/students/:id",
//             //     element: <StudentForm key="studentUpdate" />,
//             // },
//             {
//                 path: "/student/:id/profile",
//                 element: <StudentProfileView key="studentProfile" />,
//             },
//             {
//                 path: "/admin",
//                 element: <Admin key="adminList" />,
//             },
//             {
//                 path: "/admin/create",
//                 element: <AdminForm isEditing={false} key="adminCreate" />,
//             },
//             {
//                 path: "/admin/edit/:id",
//                 element: <AdminForm isEditing={true} key="adminEdit" />,
//             },
//             {
//                 path: "/admin/:id/profile",
//                 element: <AdminProfileView key="adminProfile" />,
//             },
//             {
//                 path: "/teacher",
//                 element: <Teacher key="teacherList" />,
//             },
//             {
//                 path: "/teacher/create",
//                 element: <TeacherForm isEditing={false} key="teacherCreate" />,
//             },
//             {
//                 path: "/teacher/edit/:id",
//                 element: <TeacherForm isEditing={true} key="teacherEdit" />,
//             },
//             {
//                 path: "/teacher/:id/profile",
//                 element: <TeacherProfileView key="teacherProfile" />,
//             },
//         ],
//     },

//     {
//         path: "/",
//         element: <GuestLayout />,
//         children: [
//             {
//                 path: "login",
//                 element: <Login />,
//             },
//             {
//                 path: "forgot-password",
//                 element: <ForgotPassword />,
//             },
//             {
//                 path: "reset-password/:token",
//                 element: <ResetPassword />,
//             },
//         ],
//     },
// ]);

// export default router;

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
import TeacherDashboard from "./views/TeacherDashboard.jsx";
import TeacherForm from "./views/TeacherForm.jsx";
import TeacherProfileView from "./views/TeacherProfileView.jsx";
import Room from "./views/Room.jsx";
import Unauthorized from "./views/Unauthorized.jsx";
import { useStateContext } from "./contexts/ContextProvider.jsx";
import ProtectedRoute from "./components/Route/ProtectedRoute.jsx";
import AttendanceReport from "./views/AttendanceReport.jsx";
import LessonReport from "./views/LessonReport.jsx";
import StudentAttendance from "./views/StudentAttendance.jsx";

// Check the user role and render the dashboard accordingly
const DashboardWrapper = () => {
    // Get the user object from the context
    const { user } = useStateContext();

    // Render the dashboard based on the user role
    if (user?.role_id === 1) {
        return <AdminDashboard />;
    } else if (user?.role_id === 2) {
        return <TeacherDashboard />;
    }
};

// Main Router Setup
const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "/dashboard",
                element: (
                    <ProtectedRoute requiredRoles={["admin", "teacher"]}>
                        <DashboardWrapper />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/profile",
                element: (
                    <ProtectedRoute requiredRoles={["admin"]}>
                        <AdminProfile />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/users",
                element: (
                    <ProtectedRoute requiredRoles={["admin"]}>
                        <Users />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/users/new",
                element: (
                    <ProtectedRoute requiredRoles={["admin"]}>
                        <UserForm key="userCreate" />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/users/:id",
                element: (
                    <ProtectedRoute requiredRoles={["admin"]}>
                        <UserForm key="userUpdate" />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/timetable",
                element: (
                    <ProtectedRoute requiredRoles={["admin"]}>
                        <Timetable />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/timetabletest",
                element: (
                    <ProtectedRoute requiredRoles={["admin"]}>
                        <Scheduler />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/room",
                element: (
                    <ProtectedRoute requiredRoles={["admin"]}>
                        <Room />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/lesson",
                element: (
                    <ProtectedRoute requiredRoles={["admin"]}>
                        <Lesson />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/attendance",
                element: (
                    <ProtectedRoute requiredRoles={["teacher"]}>
                        <Attendance />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/attendance-report",
                element: (
                    <ProtectedRoute requiredRoles={["teacher"]}>
                        <AttendanceReport />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/lesson-report",
                element: (
                    <ProtectedRoute requiredRoles={["teacher"]}>
                        <LessonReport />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/student/attendance/:id",
                element: (
                    <ProtectedRoute requiredRoles={["teacher"]}>
                        <StudentAttendance />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/invoices",
                element: (
                    <ProtectedRoute requiredRoles={["admin"]}>
                        <Invoice />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/invoice/create",
                element: (
                    <ProtectedRoute requiredRoles={["admin"]}>
                        <InvoiceForm isEditing={false} key="invoiceCreate" />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/invoice/edit/:id",
                element: (
                    <ProtectedRoute requiredRoles={["admin"]}>
                        <InvoiceForm isEditing={true} key="invoiceEdit" />
                    </ProtectedRoute>
                ),
            },
            // {
            //     path: "/invoices/new",
            //     element: (
            //         <ProtectedRoute requiredRoles={["admin"]}>
            //             <InvoiceForm key="invoiceCreate" />
            //         </ProtectedRoute>
            //     ),
            // },
            // {
            //     path: "/invoices/:id",
            //     element: (
            //         <ProtectedRoute requiredRoles={["admin"]}>
            //             <InvoiceForm key="invoiceUpdate" />
            //         </ProtectedRoute>
            //     ),
            // },
            // {
            //     path: "/invoiceTemplate",
            //     element: <InvoiceTemplate invoice={exampleInvoice} />,
            // },
            {
                path: "/invoiceTemplate/:id",
                element: (
                    <ProtectedRoute requiredRoles={["admin"]}>
                        <InvoiceTemplate key="invoiceTemplate" />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/students",
                element: (
                    <ProtectedRoute requiredRoles={["admin", "teacher"]}>
                        <Students key="studentList" />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/student/create",
                element: (
                    <ProtectedRoute requiredRoles={["admin"]}>
                        <StudentForm isEditing={false} key="studentCreate" />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/student/edit/:id",
                element: (
                    <ProtectedRoute requiredRoles={["admin"]}>
                        <StudentForm isEditing={true} key="studentEdit" />
                    </ProtectedRoute>
                ),
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
                element: (
                    <ProtectedRoute requiredRoles={["admin", "teacher"]}>
                        <StudentProfileView key="studentProfile" />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/admins",
                element: (
                    <ProtectedRoute requiredRoles={["admin"]}>
                        <Admin key="adminList" />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/admin/create",
                element: (
                    <ProtectedRoute requiredRoles={["admin"]}>
                        <AdminForm isEditing={false} key="adminCreate" />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/admin/edit/:id",
                element: (
                    <ProtectedRoute requiredRoles={["admin"]}>
                        <AdminForm isEditing={true} key="adminEdit" />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/admin/:id/profile",
                element: (
                    <ProtectedRoute requiredRoles={["admin"]}>
                        <AdminProfileView key="adminProfile" />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/teachers",
                element: (
                    <ProtectedRoute requiredRoles={["admin", "teacher"]}>
                        <Teacher key="teacherList" />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/teacher/create",
                element: (
                    <ProtectedRoute requiredRoles={["admin"]}>
                        <TeacherForm isEditing={false} key="teacherCreate" />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/teacher/edit/:id",
                element: (
                    <ProtectedRoute requiredRoles={["admin"]}>
                        <TeacherForm isEditing={true} key="teacherEdit" />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/teacher/:id/profile",
                element: (
                    <ProtectedRoute requiredRoles={["admin", "teacher"]}>
                        <TeacherProfileView key="teacherProfile" />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/unauthorized",
                element: <Unauthorized />,
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
