// import React, { useState } from 'react';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

// const Invoice = () => {
//   const [subject1Fee, setSubject1Fee] = useState(0);
//   const [subject2Fee, setSubject2Fee] = useState(0);

//   const handleSubject1FeeChange = (e) => {
//     setSubject1Fee(parseFloat(e.target.value));
//   };

//   const handleSubject2FeeChange = (e) => {
//     setSubject2Fee(parseFloat(e.target.value));
//   };

//   const calculateTotal = () => {
//     return subject1Fee + subject2Fee;
//   };

//   const generateInvoicePDF = () => {
//     const invoiceContent = document.getElementById('invoice-content');

//     html2canvas(invoiceContent).then((canvas) => {
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF();
//       const imgWidth = 210;
//       const pageHeight = 297;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       let heightLeft = imgHeight;
//       let position = 0;

//       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;

//       while (heightLeft >= 0) {
//         position = heightLeft - imgHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;
//       }

//       pdf.save('invoice.pdf');
//     });
//   };

//   return (
//     <div>
//       <h2>Invoice</h2>
//       <div id="invoice-content">
//         <div>
//           <label>Subject 1 Fee: $</label>
//           <input type="number" value={subject1Fee} onChange={handleSubject1FeeChange} />
//         </div>
//         <div>
//           <label>Subject 2 Fee: $</label>
//           <input type="number" value={subject2Fee} onChange={handleSubject2FeeChange} />
//         </div>
//         <div>
//           <h3>Total: ${calculateTotal()}</h3>
//         </div>
//       </div>
//       <button onClick={generateInvoicePDF}>Generate PDF</button>
//     </div>
//   );
// };

// export default Invoice;

// import { useEffect } from "react";
// import { useState } from "react";
// import { Link } from "react-router-dom";
// import axiosClient from "../axiosClient";

// export default function Invoice() {
   

//     return (
//         <>
//             <div className="container">
//                 <div className="d-flex justify-content-between align-items-center">
//                     <h1>Invoices</h1>
//                     <Link className="btn btn-primary" to="">
//                         New Invoice
//                     </Link>
//                 </div>
//                 <div className="card mt-3">
//                     <table className="table">
//                         <thead>
//                             <tr>
//                                 <th>ID</th>
//                                 <th>Name</th>
//                                 <th>Total Payable</th>
//                                 <th>Total Paid</th>
//                                 <th>Balance</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                     </table>
//                 </div>
//             </div>
//         </>
//     );
// }

// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

// export default function Invoice() {
//     const [subject1Fee, setSubject1Fee] = useState(0);
//     const [subject2Fee, setSubject2Fee] = useState(0);

//     const handleSubject1FeeChange = (e) => {
//         setSubject1Fee(parseFloat(e.target.value));
//     };

//     const handleSubject2FeeChange = (e) => {
//         setSubject2Fee(parseFloat(e.target.value));
//     };

//     const calculateTotal = () => {
//         return subject1Fee + subject2Fee;
//     };

//     const generateInvoicePDF = () => {
//         const invoiceContent = document.getElementById('invoice-content');

//         html2canvas(invoiceContent).then((canvas) => {
//             const imgData = canvas.toDataURL('image/png');
//             const pdf = new jsPDF();
//             const imgWidth = 210;
//             const pageHeight = 297;
//             const imgHeight = (canvas.height * imgWidth) / canvas.width;
//             let heightLeft = imgHeight;
//             let position = 0;

//             pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//             heightLeft -= pageHeight;

//             while (heightLeft >= 0) {
//                 position = heightLeft - imgHeight;
//                 pdf.addPage();
//                 pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//                 heightLeft -= pageHeight;
//             }

//             pdf.save('invoice.pdf');
//         });
//     };

//     return (
//         <>
//             <div className="container">
//                 <div className="d-flex justify-content-between align-items-center">
//                     <h1>Invoices</h1>
//                     <Link className="btn btn-primary" to="">
//                         New Invoice
//                     </Link>
//                 </div>
//                 <div id="invoice-content">
//                 <div className="card mt-3">
//                     <table className="table">
//                         <thead>
//                             <tr>
//                                 <th>ID</th>
//                                 <th>Name</th>
//                                 <th>Total Payable</th>
//                                 <th>Total Paid</th>
//                                 <th>Balance</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             <tr>
//                                 <td>1</td>
//                                 <td>John Doe</td>
//                                 <td>${calculateTotal()}</td>
//                                 <td>$0</td>
//                                 <td>${calculateTotal()}</td>
//                                 <td>
//                                     <button className="btn btn-primary" onClick={generateInvoicePDF}>Generate PDF</button>
//                                 </td>
//                             </tr>
//                         </tbody>
//                     </table>
//                 </div>
//                 </div>
//             </div>
//         </>
//     );
// }

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axiosClient";

export default function Invoice() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getInvoices();
    }, []);

    const onDeleteClick = (invoice) => {
        if (!window.confirm("Are you sure you want to delete this invoice?")) {
            return;
        }
        axiosClient.delete(`/invoices/${invoice.id}`).then(() => {
            getInvoices();
        });
    };

    const getInvoices = () => {
        setLoading(true);
        axiosClient
            .get("/invoices")
            .then(({ data }) => {
                setLoading(false);
                // Calculate total payable and balance for each invoice
                const updatedInvoices = data.data.map(invoice => {
                    const totalPayable = parseFloat(invoice.subject1Fee) + parseFloat(invoice.subject2Fee);
                    const totalPaid = 0; // Set total paid to 0
                    const balance = totalPayable - totalPaid;
    
                    return {
                        ...invoice,
                        totalPayable,
                        totalPaid,
                        balance
                    };
                });
                setInvoices(updatedInvoices);
            })
            .catch(() => {
                setLoading(false);
            });
    };
    

    return (
        <>
            <div className="container">
                <div className="d-flex justify-content-between align-items-center">
                    <h1>Invoices</h1>
                    <Link className="btn btn-primary" to="/invoices/new">
                        New Invoice
                    </Link>
                </div>
                <div className="card mt-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Subject 1 Fee</th>
                                <th>Subject 2 Fee</th>
                                <th>Total Payable</th>
                                <th>Total Paid</th>
                                <th>Balance</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="text-center">
                                        Loading...
                                    </td>
                                </tr>
                            ) : (
                                invoices.map((invoice) => (
                                    <tr key={invoice.id}>
                                        <td>{invoice.id}</td>
                                        <td>{invoice.name}</td>
                                        <td>{invoice.subject1Fee}</td>
                                        <td>{invoice.subject2Fee}</td>
                                        <td>{invoice.totalPayable}</td>
                                        <td>{invoice.totalPaid}</td>
                                        <td>{invoice.balance}</td>
                                        <td>
                                            <Link
                                                className="btn btn-primary"
                                                to={`/invoices/${invoice.id}`}
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                className="btn btn-danger ms-2"
                                                onClick={() => onDeleteClick(invoice)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
