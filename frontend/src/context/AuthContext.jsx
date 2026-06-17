import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  userLogin, 
  userLogout, 
  userRegister,
  verifyEmail,
  verifyEmailRequest,
  getUser,
  userForgetPassword,
  userPasswordForgetRequest,
  changeUserCurrentPassword,
  userAccessTokenRefreshed,
  userRefreshTokenRefreshed
 } from '../apis/api';
 
import { LocalStorage } from '../apis/index';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const savedUser = LocalStorage.get("user")
    if (savedUser) {
      setUser(savedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
     const res = await userLogin({email, password})
     console.log(res.data.data.user)
     const { user, accessToken } = res.data.data
     LocalStorage.set("accessToken", accessToken)
     LocalStorage.set("user", user)
     setUser(user)
     return res.data
  };

  const register = async (email, name, password) => {
    const res = await userRegister({email, fullName : name , password})
    return res.data
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

  const verifyEmail = async(token, email) => {
    const res = await verifyEmail()
  }

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
      forgotPassword,
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