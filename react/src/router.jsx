import { createBrowserRouter } from "react-router-dom";
import Login from "./views/Login.jsx";
import DefaultLayout from "./components/DefaultLayout.jsx";
import GuestLayout from "./components/GuestLayout.jsx";
import Users from "./views/Users.jsx";
import UserForm from "./views/UserForm.jsx";
import Scheduler from "./views/Scheduler.jsx";
import Lesson from "./views/Lesson.jsx";
import Invoice from './views/Invoice.jsx';
import InvoiceForm from './views/InvoiceForm.jsx';
import InvoiceTemplate from "./views/InvoiceTemplate.jsx";

const exampleInvoice = {
    id: '1234',
    date: '2024-05-02',
    customerName: 'John Doe',
    address: '123 Main St, Anytown, USA',
    email: 'john@example.com',
    items: [
      { name: 'Subject Math', quantity: 2, price: 100 },
      { name: 'Subject English', quantity: 1, price: 300 }
    ],
    total: 95 // Calculated based on the items
  };

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
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
                element: <Scheduler />,
            },
            {
                path: "/lesson",
                element: <Lesson />,
            },
            {
                path: '/invoices',
                element: <Invoice />
            },
            {
                path: '/invoices/new',
                element: <InvoiceForm key="invoiceCreate" />
            },
            {
                path: '/invoices/:id',
                element: <InvoiceForm key="invoiceUpdate" />
            },
            {
                path: '/invoiceTemplate',
                element: <InvoiceTemplate invoice={exampleInvoice} />
            }
        ],
},

    {
        path: "/",
        element: <GuestLayout />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
        ],
    },
]);

export default router;
