import { createContext, useState} from 'react';
import { useNavigate} from 'react-router-dom'
import React from 'react';


export const AuthContext = createContext();



export const AuthProvider = ({ children }) => {

  

  const [token, setToken] = useState("")
  const navigate = useNavigate();

 const backendURL = 'http://localhost:3000';


   const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("mobile");
    localStorage.removeItem("role");

    localStorage.removeItem("_id");
    navigate("/login");
  };

    




  return (
    <AuthContext.Provider value={{  backendURL, navigate, setToken, token, handleLogOut }}>

      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;


