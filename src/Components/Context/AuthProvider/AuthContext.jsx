import React, { createContext, useContext, useState,useEffect,useMemo } from 'react';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const userFromLocalStorage = getUserLocalStorage();
    if (userFromLocalStorage) {
      setUser(userFromLocalStorage);
    }
  }, []);
  

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    clearUserLocalStorage();
  };

  const value = useMemo(() => ({
    user,
    login: handleLogin,
    logout: handleLogout,
  }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    return useContext(AuthContext);
  }

export function setUserLocalStorage(user){
    localStorage.setItem('authData',JSON.stringify(user))
}

export function getUserLocalStorage(){
    const json = localStorage.getItem('authData');
    return JSON.parse(json) ?? null;
}


export function removeUserLocalStorage() {
    localStorage.removeItem('authData');
  }
