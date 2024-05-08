import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axiosClient";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 

export default function StudentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState({
    id: null,
    name: '',
    gender: '',
    birth_date: new Date(),
    age: '',
    nationality: '',
    address: '',
    postal_code: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  // If id is present, fetch the user data by making a GET request to the API
  if (id) {
    useEffect(() => {
      setLoading(true)
      axiosClient.get(`/students/${id}`)
        .then(({ data }) => {
          setLoading(false)
          setStudents(data)
        })
        .catch(() => {
          setLoading(false)
        })
    }, [])
  }

  const onSubmit = ev => {
    ev.preventDefault()
    if (students.id) {
      axiosClient.put(`/students/${students.id}`, students)
        .then(() => {
          navigate('/students')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    } else {
      axiosClient.post('/students', students)
        .then(() => {
          navigate('/students')
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
      {students.id && <h1 className="text-center">Update Student Info: {students.name}</h1>}
      {!students.id && <h1 className="text-center">Student Registration Form</h1>}
      <div className="card animated fadeInDown mx-auto" style={{ maxWidth: '800px' }}>
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
          <form onSubmit={onSubmit} className="mt-4">
            <div className="card-body">
              <div className="form-group mb-3">
                <label htmlFor="nameInput" className="form-label">Student Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="nameInput"
                  value={students.name}
                  onChange={ev => setStudents({ ...students, name: ev.target.value })}
                  placeholder="Enter student name"
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-4 pb-2">
                  <label className="form-label">Date of Birth</label>
                  <DatePicker
                    selected={students.birth_date}
                    onChange={date => setStudents({ ...students, birth_date: date })}
                    placeholderText="Select date of birth"
                    dateFormat="yyyy-MM-dd"
                    className="form-control"
                  />
                </div>
                <div className="col-md-6 mb-4">
                  <label className="form-label">Gender</label>
                  <div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender"
                        id="femaleGender"
                        value="female"
                        checked={students.gender === "female"}
                        onChange={ev => setStudents({ ...students, gender: ev.target.value })}
                      />
                      <label className="form-check-label" htmlFor="femaleGender">Female</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender"
                        id="maleGender"
                        value="male"
                        checked={students.gender === "male"}
                        onChange={ev => setStudents({ ...students, gender: ev.target.value })}
                      />
                      <label className="form-check-label" htmlFor="maleGender">Male</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-4 pb-2">
                  <label htmlFor="ageInput" className="form-label">Age</label>
                  <input
                    type="number"
                    className="form-control"
                    id="ageInput"
                    value={students.age}
                    onChange={ev => setStudents({ ...students, age: ev.target.value })}
                    placeholder="Enter age"
                  />
                </div>
                <div className="col-md-6 mb-4 pb-2">
                  <label htmlFor="nationalityInput" className="form-label">Nationality</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nationalityInput"
                    value={students.nationality}
                    onChange={ev => setStudents({ ...students, nationality: ev.target.value })}
                    placeholder="Enter nationality"
                  />
                </div>
              </div>
              <div className="form-group mb-3">
                <label htmlFor="addressInput" className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="addressInput"
                  value={students.address}
                  onChange={ev => setStudents({ ...students, address: ev.target.value })}
                  placeholder="Enter address"
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="postalCodeInput" className="form-label">Postal Code</label>
                <input
                  type="text"
                  className="form-control"
                  id="postalCodeInput"
                  value={students.postal_code}
                  onChange={ev => setStudents({ ...students, postal_code: ev.target.value })}
                  placeholder="Enter postal code"
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