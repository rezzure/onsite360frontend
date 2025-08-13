
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../ContextApi/AuthContext';
import { useContext } from 'react';




export default function ProtectedRoute({ roles, children }) {

  const { user } = useContext(AuthContext)
  

  if (!user) {
    Navigate('/login')
  }


  // Wrong role

  // if (!roles.includes(user.role)) {
  //   return(
  //     Navigate('//unauthorized')
  //   )
    
  // }
 
  return children;
}