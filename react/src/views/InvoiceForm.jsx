import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axiosClient";

export default function InvoiceForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState({
        id: null,
        name: '',
        subject1Fee: '',
        subject2Fee: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [students, setStudents] = useState([]);

    // Fetch student data from the backend API
    useEffect(() => {
        axiosClient.get(`/students`)
            .then(({ data }) => {
                // Check if the data object contains a 'data' property
                if (data && Array.isArray(data.data)) {
                    setStudents(data.data); // Extract 'data' array from the response
                } else {
                    console.error("Invalid data format for students:", data);
                    // Handle the error or set students to an empty array
                    setStudents([]);
                }
            })
            .catch(error => {
                console.error("Error fetching student data:", error);
                // Handle the error or set students to an empty array
                setStudents([]);
            });
    }, []);

    // If id is present, fetch the invoice data by making a GET request to the API
    if (id) {
        useEffect(() => {
            setLoading(true)
            axiosClient.get(`/invoices/${id}`)
                .then(({ data }) => {
                    setLoading(false)
                    setInvoice(data)
                })
                .catch(() => {
                    setLoading(false)
                })
        }, [])
    }

    const onSubmit = ev => {
        ev.preventDefault()
        if (invoice.id) {
            axiosClient.put(`/invoices/${invoice.id}`, invoice)
                .then(() => {
                    navigate('/invoices')
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors)
                    }
                })
        } else {
            axiosClient.post('/invoices', invoice)
                .then(() => {
                    navigate('/invoices')
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors)
                    }
                })
        }
    }

    return (
        <>
            {invoice.id && <h1 className="text-center">Update Invoice: {invoice.name}</h1>}
            {!invoice.id && <h1 className="text-center">New Invoice</h1>}
            <div className="card animated fadeInDown mx-auto" style={{ maxWidth: '400px' }}>
                {loading && (
                    <div className="card-body text-center">
                        <div className="spinner-border" role="status">
                            {/* <span className="sr-only">Loading...</span> */}
                        </div>
                    </div>
                )}
                {errors && (
                    <div className="alert alert-danger">
                        {Object.keys(errors).map(key => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                )}

                {!loading && (
                    <form onSubmit={onSubmit}>
                        <div className="card-body">
                            <div className="form-group mb-3">
                                <select
                                    className="form-control"
                                    value={invoice.name}
                                    onChange={ev => setInvoice({ ...invoice, name: ev.target.value })}
                                >
                                    <option value="">Select Name</option>
                                    {students.map(student => (
                                        <option key={student.id} value={student.name}>{student.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group mb-3">
                                <input
                                    type="number"
                                    className="form-control"
                                    value={invoice.subject1Fee}
                                    onChange={ev => {
                                        const value = parseFloat(ev.target.value);
                                        if (!isNaN(value)) {
                                            setInvoice({ ...invoice, subject1Fee: value });
                                        }
                                    }}
                                    placeholder="Subject 1 Fee"
                                />
                            </div>
                            <div className="form-group mb-3">
                                <input
                                    type="number"
                                    className="form-control"
                                    value={invoice.subject2Fee}
                                    onChange={ev => {
                                        const value = parseFloat(ev.target.value);
                                        if (!isNaN(value)) {
                                            setInvoice({ ...invoice, subject2Fee: value });
                                        }
                                    }}
                                    placeholder="Subject 2 Fee"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary btn-block">Save</button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}
