import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axiosClient";

export default function UserForm(){
    const {id} = useParams();
    const navigate = useNavigate();
    const [user, setUsers] = useState({
        id: null,
        name: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    if(id)
    {
        useEffect(() => {
            setLoading(true)
            axiosClient.get(`/users/${id}`)
              .then(({data}) => {
                setLoading(false)
                setUsers(data)
              })
              .catch(() => {
                setLoading(false)
              })
          }, [])
    }

    const onSubmit = ev => {
        ev.preventDefault()
        if (user.id) {
          axiosClient.put(`/users/${user.id}`, user)
            .then(() => {
              navigate('/users')
            })
            .catch(err => {
              const response = err.response;
              if (response && response.status === 422) {
                setErrors(response.data.errors)
              }
            })
        } else {
          axiosClient.post('/users', user)
            .then(() => {
              navigate('/users')
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
          {user.id && <h1 className="text-center">Update User: {user.name}</h1>}
          {!user.id && <h1 className="text-center">New User</h1>}
          <div className="card animated fadeInDown mx-auto" style={{ maxWidth: '400px' }}>
            {loading && (
              <div className="card-body text-center">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
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
                  <div className="form-group mb-3"> {/* Added mb-3 class for margin bottom */}
                    <input
                      type="text"
                      className="form-control"
                      value={user.name}
                      onChange={ev => setUsers({ ...user, name: ev.target.value })}
                      placeholder="Name"
                    />
                  </div>
                  <div className="form-group mb-3"> {/* Added mb-3 class for margin bottom */}
                    <input
                      type="email"
                      className="form-control"
                      value={user.email}
                      onChange={ev => setUsers({ ...user, email: ev.target.value })}
                      placeholder="Email"
                    />
                  </div>
                  <div className="form-group mb-3"> {/* Added mb-3 class for margin bottom */}
                    <input
                      type="password"
                      className="form-control"
                      onChange={ev => setUsers({ ...user, password: ev.target.value })}
                      placeholder="Password"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">Save</button>
                </div>
              </form>
            )}
          </div>
        </>
      )      
}