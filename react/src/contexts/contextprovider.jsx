// import React, { useContext, useState, createContext, useEffect } from "react";
// import axios from "axios";

// const StateContext = createContext({
//   user: null,
//   token: null,
//   csrfToken: null,
//   setUser: () => {},
//   setToken: () => {},
//   csrf: () => {},
// });

// export const ContextProvider = ({ children }) => {
//   const [user, setUser] = useState({});
//   const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
//   const [csrfToken, setCsrfToken] = useState(null);

//   const setToken = (token) => {
//     _setToken(token);
//     if (token) {
//       localStorage.setItem("ACCESS_TOKEN", token);
//     } else {
//       localStorage.removeItem("ACCESS_TOKEN");
//     }
//   };

//   const csrf = async () => {
//     try {
//       const response = await axios.get("/csrf-token"); // Adjust the endpoint as necessary
//       setCsrfToken(response.data.csrfToken);
//     } catch (error) {
//       console.error("Failed to fetch CSRF token:", error);
//     }
//   };

//   useEffect(() => {
//     csrf();
//   }, []);

//   return (
//     <StateContext.Provider
//       value={{
//         user,
//         token,
//         csrfToken,
//         setUser,
//         setToken,
//         csrf,
//       }}
//     >
//       {children}
//     </StateContext.Provider>
//   );
// };

// export const useStateContext = () => useContext(StateContext);

import React, { useContext, useState, createContext, useEffect } from "react";
import axios from "axios";

const StateContext = createContext({
  user: null,
  token: null,
  csrfToken: null,
  setUser: () => {},
  setToken: () => {},
  csrf: () => {},
});

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
  const [csrfToken, setCsrfToken] = useState(null);

  const setToken = (token) => {
    _setToken(token);
    if (token) {
      localStorage.setItem("ACCESS_TOKEN", token);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };

  const csrf = async () => {
    try {
      const response = await axios.get("/csrf-token"); // Adjust the endpoint as necessary
      setCsrfToken(response.data.csrfToken);
    } catch (error) {
      console.error("Failed to fetch CSRF token:", error);
    }
  };

  useEffect(() => {
    csrf();
  }, []);

  return (
    <StateContext.Provider
      value={{
        user,
        token,
        csrfToken,
        setUser,
        setToken,
        csrf,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
