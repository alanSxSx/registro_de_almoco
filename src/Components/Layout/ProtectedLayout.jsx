import React from 'react';
import Registro from '../Pages/Registro';
import Login from '../Pages/Login';
import { useAuth, getUserLocalStorage } from '../Context/AuthProvider/AuthContext';

export const ProtectedLayout = ({ children }) => {
  const storedUserData = getUserLocalStorage();
  const auth = useAuth();
 

  if (!auth && !storedUserData) {
    return (
     <>
     <Login/>
     </>
    );
  }

  const isAdmin = auth?.user?.isAdmin || storedUserData?.isAdmin;

  if (!isAdmin) {
    return (
      <>
        <Registro/>
      </>
    );
  }

  return children;
};