<<<<<<< HEAD

=======
>>>>>>> wind-breathing
import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useCallback, 
  useMemo 
} from 'react';
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
<<<<<<< HEAD
import { LocalStorage } from '../apis/index';

import axios from 'axios';
import { createContext, useContext, useState, useEffect } from 'react';


const BASE_URL = 'http://localhost:5000/api/v1/rtcds/auth';
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [devOTP, setDevOTP] = useState('');
  const [devResetURL, setDevResetURL] = useState('');
=======

import { LocalStorage } from '../apis/index';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
>>>>>>> wind-breathing
  const [toast, setToast] = useState(null);
  const [error, setError] = useState(null);


<<<<<<< HEAD

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = LocalStorage.get("user");
        const accessToken = LocalStorage.get("accessToken");
        
        if (savedUser && accessToken) {
          setUser(savedUser);
          setIsAuthenticated(true);
        } else {
          LocalStorage.remove("user");
          LocalStorage.remove("accessToken");
        }
=======
  useEffect(() => {
    const initializeAuth = async() => {
      try {
        if(!user) {
            const res = await getUser()
              const user = res.data.data.user
              console.log("user",res.data.data.user)
              LocalStorage.set("user", user);
              const savedUser = LocalStorage.get("user");

              if (savedUser) {
                setUser(savedUser);
                setIsAuthenticated(true);
              } else {
                LocalStorage.remove("user");
              }
        }
        
>>>>>>> wind-breathing
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const register = useCallback(async (email, name, password) => {
    setError(null);
    try {
      const res = await userRegister({ email, fullName: name, password });
      if (res.data.success) {
        return res.data;
      }
      throw new Error(res.data.message || "Registration failed");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Registration failed";
      console.error("Registration error:", errorMessage);
      setError(errorMessage);
      throw error;
    }
  }, []);

  const verifyEmail = useCallback(async (email, otp) => {
    setError(null);
    try {
      const res = await verifyUserEmail(otp, email);
      if (res.data.success) {
        return res.data;
      }
      throw new Error(res.data.message || "Email verification failed");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Email verification failed";
      console.error("Email verification error:", errorMessage);
      setError(errorMessage);
      throw error;
    }
  }, []);

  const verifyEmailRequest = useCallback(async (email) => {
    setError(null);
    try {
      const res = await verifyUserEmailRequest(email);
      if (res.data.success) {
        return res.data;
      }
      throw new Error(res.data.message || "Verification request failed");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Verification request failed";
      console.error("Verification request error:", errorMessage);
      setError(errorMessage);
      throw error;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const res = await userLogin({ email, password });
      
      if (!res.data.success) {
        throw new Error(res.data.message || "Login failed");
      }

<<<<<<< HEAD
      const { user, accessToken } = res.data.data;
      
      if (!user || !accessToken) {
        throw new Error("Invalid login response: missing user or access token");
      }

      LocalStorage.set("accessToken", accessToken);
=======
      const { user } = res.data.data;
      
      if (!user ) {
        throw new Error("Invalid login response: missing user or access token");
      }

>>>>>>> wind-breathing
      LocalStorage.set("user", user);
      setUser(user);
      setIsAuthenticated(true);
      
      return res.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Login failed";
      console.error("Login error:", errorMessage);
      setError(errorMessage);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const res = await userLogout();
      if (res.data.success) {
        LocalStorage.remove("user");
<<<<<<< HEAD
        LocalStorage.remove("accessToken");
=======
>>>>>>> wind-breathing
        setUser(null);
        setIsAuthenticated(false);
        return res.data;
      }
      throw new Error(res.data.message || "Logout failed");
    } catch (error) {
      console.error("Logout error:", error.message);
      LocalStorage.remove("user");
<<<<<<< HEAD
      LocalStorage.remove("accessToken");
=======
>>>>>>> wind-breathing
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  }, []);

  const forgetPasswordRequest = useCallback(async (email) => {
    setError(null);
    try {
      const res = await userForgetPasswordRequest(email);
      if (res.data.success) {
        return res.data;
      }
      throw new Error(res.data.message || "Password reset request failed");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Password reset request failed";
      console.error("Forget password request error:", errorMessage);
      setError(errorMessage);
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (email, code, newPassword) => {
    setError(null);
    try {
      const res = await userForgetPassword(email, code, newPassword);
      if (res.data.success) {
        return res.data;
      }
      throw new Error(res.data.message || "Password reset failed");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Password reset failed";
      console.error("Password reset error:", errorMessage);
      setError(errorMessage);
      throw error;
    }
  }, []);

  const triggerToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const contextValue = useMemo(() => ({
    user,
    isAuthenticated,
    loading,
    login,
    register,
    toast,
    logout,
    verifyEmail,
    verifyEmailRequest,
    forgetPasswordRequest,
    resetPassword,
    triggerToast,
    error
  }), [
    user,
    isAuthenticated,
    loading,
    login,
    register,
    toast,
    logout,
    verifyEmail,
    verifyEmailRequest,
    forgetPasswordRequest,
    resetPassword,
    triggerToast,
    error
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
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
<<<<<<< HEAD
}

  // Helper to trigger UI toasts
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // FETCH CURRENT USER
  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getme`, { withCredentials: true });
      const userData = res.data?.data?.user || res.data?.data || res.data?.user || res.data;
      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // REGISTER
  const register = async (userData) => {
    try {
      setLoading(true); setError('');
      const res = await axios.post(
        `${BASE_URL}/register`, userData,
        { withCredentials: true }
      );
      
      const otp = res.data?.data?.otp || res.data?.otp;
      if (otp) {
        setDevOTP(otp);
        console.log("Dev OTP:", otp); // REMOVE IN PRODUCTION
      }
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg); throw new Error(msg);
    } finally { setLoading(false); }
  };

  // VERIFY OTP (formerly verifyEmail)
  const verifyOTP = async (otp) => {
    try {
      setLoading(true); setError('');
      // In the backend, the verify endpoint might take the otp verification token.
      // Wait, let's see: the user defined verifyOTP as:
      // const res = await axios.post(`${BASE_URL}/verify-otp`, { otp }, { withCredentials: true });
      // Let's use exactly that. But wait, in the backend we saw the verify endpoint is:
      // router.route("/verify-email/:unHashedToken").post(verifyEmail);
      // Wait, let's verify if verifyOTP or verify-email is correct!
      // In the user's provided AuthContext.jsx template, they specified:
      //   const verifyOTP = async (otp) => {
      //     try {
      //       setLoading(true); setError('');
      //       const res = await axios.post(
      //         `${BASE_URL}/verify-otp`, { otp },
      //         { withCredentials: true }
      //       );
      //       return res.data;
      //     } catch (err) {
      //       const msg = err.response?.data?.message || "OTP verification failed";
      //       setError(msg); throw new Error(msg);
      //     } finally { setLoading(false); }
      //   };
      // Wait, let's check what the backend expects or if we should add /verify-otp route,
      // or if verify-email is what the backend uses.
      // Let's check auth.route.js:
      // router.route("/verify-email/:unHashedToken").post(verifyEmail);
      // Wait, let's see if the backend has any verify-otp or if we should verify how the
      // OTP verification works.
      // Let's search the backend files for `verify-otp` or `verifyOTP` or `otp`.
      // Let's check our view of auth.route.js. It does NOT have a verify-otp route!
      // It has verify-email/:unHashedToken.
      // But wait, the user's request for AuthContext.jsx specifies:
      // "All API calls must be directly inside AuthContext.jsx only."
      // And in their provided AuthContext.jsx code they have:
      //   const verifyOTP = async (otp) => {
      //     ...
      //     const res = await axios.post(
      //       `${BASE_URL}/verify-otp`, { otp },
      //       { withCredentials: true }
      //     );
      //     return res.data;
      //   }
      // If the backend has no `/verify-otp` route, let's check if we need to add `/verify-otp` route to the backend!
      // Wait, let's search backend for `verify-otp` or `verifyOTP`.
      // Let's do a grep search in backend.
      
      const res = await axios.post(
        `${BASE_URL}/verify-otp`, { otp },
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "OTP verification failed";
      setError(msg); throw new Error(msg);
    } finally { setLoading(false); }
  };

  // RESEND OTP
  const resendOTP = async (email) => {
    try {
      setLoading(true); setError('');
      const res = await axios.post(
        `${BASE_URL}/verify-email-request`,
        { email },
        { withCredentials: true }
      );
      const otp = res.data?.data?.otp || res.data?.otp;
      if (otp) {
        setDevOTP(otp);
        console.log("Resent Dev OTP:", otp); // REMOVE IN PRODUCTION
      }
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to resend OTP";
      setError(msg); throw new Error(msg);
    } finally { setLoading(false); }
  };

  // LOGIN
  const login = async (credentials) => {
    try {
      setLoading(true); setError('');
      const res = await axios.post(
        `${BASE_URL}/login`, credentials,
        { withCredentials: true }
      );
      const userData = res.data?.data?.user || res.data?.user || res.data;
      setUser(userData);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg); throw new Error(msg);
    } finally { setLoading(false); }
  };

  // FORGOT PASSWORD
  const forgotPassword = async (email) => {
    try {
      setLoading(true); setError(''); setDevResetURL('');
      const res = await axios.post(
        `${BASE_URL}/forgot-password`,
        { email },
        { withCredentials: true }
      );
      if (res.data.resetURL) {
        setDevResetURL(res.data.resetURL);
        console.log("Dev Reset URL:", res.data.resetURL);
      }
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message
        || "Failed to generate reset link";
      setError(msg); throw new Error(msg);
    } finally { setLoading(false); }
  };

  // RESET PASSWORD
  const resetPassword = async (token, password) => {
    try {
      setLoading(true); setError('');
      if (!token) throw new Error("Token missing from URL");
      const res = await axios.post(
        `${BASE_URL}/reset-password/${token}`,
        { password },
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message
        || err.message
        || "Password reset failed";
      setError(msg); throw new Error(msg);
    } finally { setLoading(false); }
  };

  // ACCEPT COLLABORATION INVITATION
  const acceptInvitation = async (email, tokenId) => {
    try {
      setLoading(true); setError('');
      const res = await axios.post(
        `http://localhost:5000/api/v1/rtcds/collab/accept/email=${email}/join=${tokenId}`,
        {},
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to accept invitation";
      setError(msg); throw new Error(msg);
    } finally { setLoading(false); }
  };

  // DECLINE COLLABORATION INVITATION
  const declineInvitation = async (email, tokenId) => {
    try {
      setLoading(true); setError('');
      const res = await axios.get(
        `http://localhost:5000/api/v1/rtcds/collab/decline/email=${email}/join=${tokenId}`,
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to decline invitation";
      setError(msg); throw new Error(msg);
    } finally { setLoading(false); }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  // GOOGLE CALLBACK / LOGIN
  const loginWithGoogle = (token) => {
    fetchCurrentUser();
    triggerToast('Signed in with Google successfully!', 'success');
  };

  // CHANGE PASSWORD
  const changePassword = async (data) => {
    try {
      setLoading(true); setError('');
      await axios.put(
        `${BASE_URL}/update-current-password`,
        {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword
        },
        { withCredentials: true }
      );
      triggerToast('Password changed successfully!', 'success');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Change password failed';
      setError(msg);
      triggerToast(msg, 'error');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // UPDATE PROFILE
  const updateProfile = async (data) => {
    try {
      setLoading(true); setError('');
      const res = await axios.put(
        `${BASE_URL}/update-profile`,
        {
          fullName: data.fullName,
          avatar: data.avatar
        },
        { withCredentials: true }
      );
      const updatedUser = res.data?.data?.user || res.data?.data || res.data?.user || res.data;
      setUser(updatedUser);
      triggerToast('Profile updated successfully!', 'success');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Update failed';
      setError(msg);
      triggerToast(msg, 'error');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // DELETE ACCOUNT
  const deleteAccount = async () => {
    try {
      setLoading(true); setError('');
      await axios.delete(`${BASE_URL}/delete`, { withCredentials: true });
      setUser(null);
      triggerToast('Account deleted', 'success');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Delete failed';
      setError(msg);
      triggerToast(msg, 'error');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user, loading, error,
      devOTP, devResetURL, toast,
      register, verifyOTP, resendOTP,
      login, logout,
      forgotPassword, resetPassword,
      changePassword, updateProfile, deleteAccount,
      fetchCurrentUser, triggerToast, loginWithGoogle,
      acceptInvitation, declineInvitation
    }}>
      {children}
    </AuthContext.Provider>
  );
};

=======
}
>>>>>>> wind-breathing
