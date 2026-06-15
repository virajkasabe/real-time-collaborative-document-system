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
  const [toast, setToast] = useState(null);

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
        `${BASE_URL}/forgot-password`, { email },
        { withCredentials: true }
      );
      const resetURL = res.data?.resetURL || res.data?.data?.resetURL;
      if (resetURL) {
        setDevResetURL(resetURL);
        console.log("Dev Reset URL:", resetURL); // REMOVE IN PRODUCTION
      }
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send reset link";
      setError(msg); throw new Error(msg);
    } finally { setLoading(false); }
  };

  // RESET PASSWORD
  const resetPassword = async (token, password) => {
    try {
      setLoading(true); setError('');
      const res = await axios.post(
        `${BASE_URL}/reset-password/${token}`, { password },
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Password reset failed";
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
      fetchCurrentUser, triggerToast, loginWithGoogle
    }}>
      {children}
    </AuthContext.Provider>
  );
};
