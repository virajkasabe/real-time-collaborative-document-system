import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  userLogin, 
  userLogout, 
  userRegister,
  verifyUserEmail,
  verifyUserEmailRequest,
  getUser,
  userForgetPassword,
  userForgetPasswordRequest,
  changeUserCurrentPassword,
  userAccessTokenRefreshed,
  userRefreshTokenRefreshed
 } from '../apis/api';

import { LocalStorage, requestHandler } from '../apis/index';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState(null)

  useEffect(() => {
    const savedUser = LocalStorage.get("user")
    if (savedUser) {
      setUser(savedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

   const register = async (email, name, password) => {
    const res = await userRegister({email, fullName : name , password})
    return res.data
  };

  const verifyEmail = async() => {
    const res = await verifyUserEmail()
  }


  const login = async(email, password) => {
     try {
      const res = await userLogin({email, password})
      const { user, accessToken } = res.data.data
      LocalStorage.set("accessToken", accessToken)
      LocalStorage.set("user", user)
      setUser(user)
      return res.data
     } catch (error) {
      console.error(error.message)
        setError(error.message)
        return error.message
     }
  };

 

  const logout = async() => {
    const res = await userLogout()
    if(res.data.success) {
      LocalStorage.remove()
      // disconnectEven 
    }
  };

  const forgetPasswordRequest = async (email) => {
    
  };

  const resetPassword = async (email, code, newPassword) => {

  };
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };


  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      register,
      toast,
      logout,
      error,
      // forgotPassword,
      resetPassword,
      triggerToast
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}