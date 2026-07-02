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
  userRefreshTokenRefreshed,
  userGoogleLogin
} from '../apis/api';
import { LocalStorage } from '../apis/index';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState(null);


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

      const { user, accessToken } = res.data.data;
      
      if (!user || !accessToken) {
        throw new Error("Invalid login response: missing user or access token");
      }

      LocalStorage.set("accessToken", accessToken);
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

  const googleLogin = useCallback(async()=>{
    setError(null)
    try {
      const res = await userGoogleLogin()
      console.log("userGoogleLogin", res.data)
       if (!res.data.success) {
        throw new Error(res.data.message || "Login failed");
      }

      const { user, accessToken } = res.data.data;
      
      if (!user || !accessToken) {
        throw new Error("Invalid login response: missing user or access token");
      }

      LocalStorage.set("accessToken", accessToken);
      LocalStorage.set("user", user);
      setUser(user);
      setIsAuthenticated(true);
      
      return res.data;

    } catch (error) {
      console.log(
        "error : " , error.message
      )
       const errorMessage = error.response?.data?.message || error.message || "Login failed";
        console.error("Login error:", errorMessage);
        setError(errorMessage);
        throw error;
    }
  },[])

  const logout = useCallback(async () => {
    try {
      const res = await userLogout();
      if (res.data.success) {
        LocalStorage.remove("user");
        LocalStorage.remove("accessToken");
        setUser(null);
        setIsAuthenticated(false);
        return res.data;
      }
      throw new Error(res.data.message || "Logout failed");
    } catch (error) {
      console.error("Logout error:", error.message);
      LocalStorage.remove("user");
      LocalStorage.remove("accessToken");
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
    googleLogin,
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
    googleLogin,
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
}