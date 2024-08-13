// import React, { useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosClient from "../axiosClient";
// import { Form, Button, Alert } from "react-bootstrap";
// import { useStateContext } from "../contexts/ContextProvider";

// export default function ForgotPassword() {
//   // Define state variables
//   const [email, setEmail] = useState('');
//   const [errors, setErrors] = useState({});
//   const [status, setStatus] = useState(null);

//   // Create reference for input element
//   const emailRef = useRef();

//   // Destructure setToken from the state context
//   const { setToken } = useStateContext();

//   // Get navigate function from react-router-dom
//   const navigate = useNavigate();

//   // Function to handle form submission
//   const handleSubmit = async (ev) => {
//     ev.preventDefault();

//     setErrors({});
//     setStatus(null);

//     try {
//       const response = await axiosClient.post("forgot-password", { email: emailRef.current.value });
//       setStatus(response.data.status);
      
//       // Optional: If you need to handle any token or additional actions
//       // const token = response.data.token;
//       // setToken(token);
      
//       // Redirect or show a success message
//       // navigate('/some-path');
//     } catch (err) {
//       if (err.response && err.response.status === 422) {
//         setErrors(err.response.data.errors);
//       } else {
//         setErrors({ server: 'An error occurred. Please try again later.' });
//       }
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <div className="row justify-content-center">
//         <div className="col-md-6">
//           <div className="card">
//             <div className="card-body">
//               <h3 className="card-title text-center mb-4">Forgot Password</h3>

//               {status && <div className="bg-green-700 m-2 p-2 rounded text-white">{status}</div>}

//               <Form onSubmit={handleSubmit}>
//                 {errors.server && <Alert variant="danger">{errors.server}</Alert>}

//                 <Form.Group className="mb-3" controlId="formEmail">
//                   <Form.Label>Email address</Form.Label>
//                   <Form.Control
//                     ref={emailRef}
//                     type="email"
//                     placeholder="Enter your email"
//                     onChange={(e) => setEmail(e.target.value)}
//                   />
//                   {errors.email && <Alert variant="danger">{errors.email}</Alert>}
//                 </Form.Group>

//                 <div className="d-grid">
//                   <Button type="submit" variant="primary">
//                     Submit
//                   </Button>
//                 </div>
//               </Form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// import React, { useState, useRef } from "react";
// import axiosClient from "../axiosClient";
// import { useStateContext } from "../contexts/ContextProvider";
// import { Form, Button, Alert } from "react-bootstrap";
// import { Link } from 'react-router-dom';

// export default function ForgotPassword() {
//   const [email, setEmail] = useState('');
//   const [errors, setErrors] = useState([]);
//   const [status, setStatus] = useState(null);
//   const { csrf, csrfToken } = useStateContext();
//   const emailRef = useRef();

//   const handleSubmit = async (ev) => {
//     ev.preventDefault();
//     await csrf();
//     setErrors([]);
//     setStatus(null);

//     try {
//       const response = await axiosClient.post(
//         "/forgot-password",
//         { email },
//         {
//           headers: {
//             "X-CSRF-Token": csrfToken, // Add CSRF token in the request header
//           },
//         }
//       );
//       setStatus(response.data.status);
//     } catch (e) {
//       if (e.response.status === 422) {
//         setErrors(e.response.data.errors);
//       }
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <div className="row justify-content-center">
//         <div className="col-md-6">
//           <div className="card">
//             <div className="card-body">
//               <h3 className="card-title text-center mb-4">Forgot Password</h3>
//               {status && <div className="bg-green-700 m-2 p-2 rounded text-white">{status}</div>}
//               <Form onSubmit={handleSubmit}>
//                 {errors.server && <Alert variant="danger">{errors.server}</Alert>}
//                 <Form.Group className="mb-3" controlId="formEmail">
//                   <Form.Label>Email address</Form.Label>
//                   <Form.Control
//                     ref={emailRef}
//                     type="email"
//                     placeholder="Enter your email"
//                     onChange={(e) => setEmail(e.target.value)}
//                   />
//                   {errors.email && <Alert variant="danger">{errors.email}</Alert>}
//                 </Form.Group>
//                 <div className="d-grid">
//                   <Button type="submit" variant="primary">
//                     Submit
//                   </Button>
//                 </div>
//                 <div className="d-grid justify-content-end">
//                   <Button className="text-muted px-0" variant="link" as={Link} to="/forgot-password">
//                     Forgot password?
//                   </Button>
//                 </div>
//               </Form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import axiosClient from '../axiosClient';
import { Form, Button, Alert } from 'react-bootstrap';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        axiosClient.post('/forgot-password', { email })
            .then(response => {
                setMessage(response.data.message);
                setErrors('');
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    setErrors(error.response.data.email);
                }
            });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Forgot Password</h3>
                            <Form onSubmit={handleSubmit}>
                                {message && <Alert variant="success">{message}</Alert>}
                                {errors && <Alert variant="danger">{errors}</Alert>}
                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>
                                <div className="d-grid">
                                    <Button type="submit" variant="primary">
                                        Send Reset Link
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
