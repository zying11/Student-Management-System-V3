import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../axiosClient";

export default function StudentProfile() {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axiosClient.get(`/students/${id}`)
            .then(({ data }) => {
                setStudent(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!student) {
        return <div>Student not found</div>;
    }

    return (
        <div className="container">
            <h1>Student Profile</h1>
            <div className="card mt-3">
                <div className="card-body">
                    <h5 className="card-title">{student.name}</h5>
                    <p className="card-text"><strong>ID:</strong> {student.id}</p>
                    <p className="card-text"><strong>Gender:</strong> {student.gender}</p>
                    <p className="card-text"><strong>Birth Date:</strong> {student.birth_date}</p>
                    <p className="card-text"><strong>Age:</strong> {student.age}</p>
                    <p className="card-text"><strong>Nationality:</strong> {student.nationality}</p>
                    <p className="card-text"><strong>Address:</strong> {student.address}</p>
                    <p className="card-text"><strong>Postal Code:</strong> {student.postal_code}</p>
                    <p className="card-text"><strong>Study Level:</strong> {student.study_level}</p>
                    <p className="card-text"><strong>Subject:</strong> {student.subject}</p>
                    <p className="card-text"><strong>Registration Date:</strong> {student.registration_date}</p>
                    <Link className="btn btn-primary" to="/students">Back to Student List</Link>
                </div>
            </div>
        </div>
    );
}
