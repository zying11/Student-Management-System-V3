import axios from "axios";
import { useEffect } from "react";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";

export default function DefaultLayout(){
    const {user, token, setUser, setToken} = useStateContext();
    if(!token){
       return <Navigate to='/login'/>
    }
    
    const onLogout =  (ev) =>{
        ev.preventDefault();
        axiosClient.get('/logout')
        .then(({}) => {
           setUser(null)
           setToken(null)
        })
    }

    useEffect(() => {
        axiosClient.get('/user')
          .then(({data}) => {
             setUser(data)
          })
      }, [])

      return (
        <div id="defaultLayout">
          <div className="container">
            <header className="d-flex justify-content-between align-items-center py-3">
              <div>
                Header
              </div>
              <div>
                {user.name}
                <a href="#" onClick={onLogout} className="btn btn-outline-danger ms-2">Logout</a>
              </div>
            </header>
            <main>
              <Outlet />
            </main>
          </div>
        </div>
      )
}