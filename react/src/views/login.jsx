import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/ContextProvider";

export default function Login() {

  // Define state variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState('');

  // Create references for input elements
  const emailRef = useRef();
  const passwordRef = useRef();

  // Destructure setUser and setToken from the state context
  const { setUser, setToken } = useStateContext();

  // Get navigate function from react-router-dom
  const navigate = useNavigate();

  // Function to handle form submission
  const Submit = (ev) => {
    ev.preventDefault();

    // Validate input fields
    const validationErrors = validate();
    setErrors(validationErrors);

    // If no validation errors, proceed with login
    if (Object.keys(validationErrors).length === 0) {
      const payload = {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };

      // Send login request to server
      axiosClient.post("/login", payload)
        .then(({ data }) => {
          setUser(data.user);
          setToken(data.token);
          navigate('/users');
        })
        .catch(err => {
          // Handle login error
          if (err.response && err.response.data && err.response.data.message) {
            setErrors({ server: err.response.data.message });
          } else {
            setErrors({ server: 'An error occurred. Please try again later.' });
          }
        });
    }
  };

  // Function to validate input fields
  const validate = () => {
    const error = {};

    // Validate email
    if (!email) {
      error.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      error.email = "Please use the correct email format";
    }

    // Validate password
    if (!password) {
      error.password = "Password is required";
    } else if (password.length < 8) {
      error.password = "Password length is 8";
    }

    return error;
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Sign In</h3>
              <form onSubmit={Submit}>
                {errors.server && <div className="alert alert-danger">{errors.server}</div>}
                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <input
                    ref={emailRef}
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <div className="alert alert-danger">{errors.email}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    ref={passwordRef}
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && <div className="alert alert-danger">{errors.password}</div>}
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Sign In
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};