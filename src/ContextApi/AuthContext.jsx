import { createContext, useEffect, useState} from 'react';
import { useNavigate} from 'react-router-dom'
import React from 'react';


export const AuthContext = createContext();



export const AuthProvider = ({ children }) => {
  const [adminExists, setAdminExists] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userDetail,setUserDetail] = useState({})

  const [token, setToken] = useState("")
  const navigate = useNavigate();

 const backendURL = 'http://localhost:3000';

  // useEffect(() => {
  //   const checkAdmin = async () => {
  //     try {
  //       const { data } = await axios.get(backendURL+ '/api/user/check-admin')
  //       setAdminExists(data.adminExists);
  //     } catch (error) {
  //       console.error('Error checking admin:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   checkAdmin();
  // }, []);

  // const userData = async()=>{
  //     const email = localStorage.getItem("email")
  //     try{
  //       const response = await fetch(`${backendURL}/api/supervisor/detail?email=${email}`,{
  //         method:"GET",
  //         headers:{
  //           "Content-type":"application/json",
  //           "token":localStorage.getItem("token")
  //         }
  //       })
  //       const data = await response.json();
  //       console.log(data)
  //       if(data.success){
  //        setUserDetail(data.data);
  //       }
  //       console.log(data.message)
  //     }
  //     catch(error){
  //       console.log(`Error:- ${error}`)
  //     }
  //   }



  return (
    <AuthContext.Provider value={{  backendURL, navigate, adminExists, loading, setToken, token }}>

      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;


