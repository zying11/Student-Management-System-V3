// import React, { useState } from 'react';
// import axiosClient from '../axiosClient';
// import { Form, Button, Alert } from 'react-bootstrap';
// import { useParams } from 'react-router-dom';

// export default function ResetPassword() {
//     const { token } = useParams();
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [passwordConfirmation, setPasswordConfirmation] = useState('');
//     const [message, setMessage] = useState('');
//     const [errors, setErrors] = useState('');

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         axiosClient.post('/reset-password', {
//             token,
//             email,
//             password,
//             password_confirmation: passwordConfirmation
//         })
//             .then(response => {
//                 setMessage(response.data.message);
//                 setErrors('');
//             })
//             .catch(error => {
//                 if (error.response && error.response.data) {
//                     setErrors(error.response.data);
//                 }
//             });
//     };

//     return (
//         <div className="container mt-5">
//             <div className="row justify-content-center">
//                 <div className="col-md-6">
//                     <div className="card">
//                         <div className="card-body">
//                             <h3 className="card-title text-center mb-4">Reset Password</h3>
//                             <Form onSubmit={handleSubmit}>
//                                 {message && <Alert variant="success">{message}</Alert>}
//                                 {errors && <Alert variant="danger">{Object.values(errors).join(', ')}</Alert>}
//                                 <Form.Group className="mb-3" controlId="formEmail">
//                                     <Form.Label>Email address</Form.Label>
//                                     <Form.Control
//                                         type="email"
//                                         placeholder="Enter your email"
//                                         value={email}
//                                         onChange={(e) => setEmail(e.target.value)}
//                                     />
//                                 </Form.Group>
//                                 <Form.Group className="mb-3" controlId="formPassword">
//                                     <Form.Label>New Password</Form.Label>
//                                     <Form.Control
//                                         type="password"
//                                         placeholder="Enter your new password"
//                                         value={password}
//                                         onChange={(e) => setPassword(e.target.value)}
//                                     />
//                                 </Form.Group>
//                                 <Form.Group className="mb-3" controlId="formPasswordConfirmation">
//                                     <Form.Label>Confirm New Password</Form.Label>
//                                     <Form.Control
//                                         type="password"
//                                         placeholder="Confirm your new password"
//                                         value={passwordConfirmation}
//                                         onChange={(e) => setPasswordConfirmation(e.target.value)}
//                                     />
//                                 </Form.Group>
//                                 <div className="d-grid">
//                                     <Button type="submit" variant="primary">
//                                         Reset Password
//                                     </Button>
//                                 </div>
//                             </Form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../axiosClient';
import { Form, Button, Alert } from 'react-bootstrap';

export default function ResetPassword() {
    const { token } = useParams();  // Get token from URL
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axiosClient.post('/reset-password', {
            token,
            email,
            password,
            password_confirmation: passwordConfirmation
        })
        .then(response => {
            setMessage(response.data.message);
            setErrors('');
            // Optionally, navigate to login page or another page after success
            navigate('/login');
        })
        .catch(error => {
            if (error.response && error.response.data) {
                setErrors(error.response.data);
            }
        });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Reset Password</h3>
                            <Form onSubmit={handleSubmit}>
                                {message && <Alert variant="success">{message}</Alert>}
                                {errors && <Alert variant="danger">{Object.values(errors).join(', ')}</Alert>}
                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formPassword">
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter your new password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formPasswordConfirmation">
                                    <Form.Label>Confirm New Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Confirm your new password"
                                        value={passwordConfirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    />
                                </Form.Group>
                                <div className="d-grid">
                                    <Button type="submit" variant="primary">
                                        Reset Password
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
