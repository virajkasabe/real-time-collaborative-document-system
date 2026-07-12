import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useCallback, 
  useMemo,
  ReactNode
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
} from '../apis/api';

import { LocalStorage } from '../apis/index';

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('collabdocs_user');
        const savedUser = storedUser ? JSON.parse(storedUser) : null;
        
        if (savedUser) {
          setUser(savedUser);
          setIsAuthenticated(true);
        } else {
          const oldSavedUser = LocalStorage.get("user");
          if (oldSavedUser) {
            setUser(oldSavedUser);
            setIsAuthenticated(true);
            localStorage.setItem('collabdocs_user', JSON.stringify(oldSavedUser));
          }
        }

        const res = await getUser();
        const serverUser = res.data?.data?.user;
        if (serverUser) {
          localStorage.setItem('collabdocs_user', JSON.stringify(serverUser));
          LocalStorage.set("user", serverUser);
          setUser(serverUser);
          setIsAuthenticated(true);
        }
      } catch (err: any) {
        console.error("Auth initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const updateUser = (updates: any) => {
    setUser((prev: any) => prev ? { ...prev, ...updates } : prev);
    const stored = JSON.parse(
      localStorage.getItem('collabdocs_user') || '{}'
    );
    localStorage.setItem('collabdocs_user',
      JSON.stringify({ ...stored, ...updates })
    );
  };

  const register = useCallback(async (email: string, name: string, password?: string) => {
    setError(null);
    try {
      const res = await userRegister({ email, fullName: name, password });
      if (res.data?.success) {
        return res.data;
      }
      throw new Error(res.data?.message || "Registration failed");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Registration failed";
      console.error("Registration error:", errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, []);

  const verifyEmail = useCallback(async (email: string, otp: string) => {
    setError(null);
    try {
      const res = await verifyUserEmail(otp, email);
      if (res.data?.success) {
        return res.data;
      }
      throw new Error(res.data?.message || "Email verification failed");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Email verification failed";
      console.error("Email verification error:", errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, []);

  const verifyEmailRequest = useCallback(async (email: string) => {
    setError(null);
    try {
      const res = await verifyUserEmailRequest(email);
      if (res.data?.success) {
        return res.data;
      }
      throw new Error(res.data?.message || "Verification request failed");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Verification request failed";
      console.error("Verification request error:", errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, []);

  const login = useCallback(async (email: string, password?: string) => {
    setError(null);
    try {
      const res = await userLogin({ email, password });
      
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Login failed");
      }

      const loggedUser = res.data?.data?.user;
      
      if (!loggedUser) {
        throw new Error("Invalid login response: missing user or access token");
      }

      localStorage.setItem('collabdocs_user', JSON.stringify(loggedUser));
      LocalStorage.set("user", loggedUser);
      setUser(loggedUser);
      setIsAuthenticated(true);
      
      return res.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Login failed";
      console.error("Login error:", errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const res = await userLogout();
      if (res.data?.success) {
        localStorage.removeItem('collabdocs_user');
        LocalStorage.remove("user");
        setUser(null);
        setIsAuthenticated(false);
        return res.data;
      }
      throw new Error(res.data?.message || "Logout failed");
    } catch (err: any) {
      console.error("Logout error:", err.message);
      localStorage.removeItem('collabdocs_user');
      LocalStorage.remove("user");
      setUser(null);
      setIsAuthenticated(false);
      throw err;
    }
  }, []);

  const forgetPasswordRequest = useCallback(async (email: string) => {
    setError(null);
    try {
      const res = await userForgetPasswordRequest(email);
      if (res.data?.success) {
        return res.data;
      }
      throw new Error(res.data?.message || "Password reset request failed");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Password reset request failed";
      console.error("Forget password request error:", errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, []);

  const resetPassword = useCallback(async (email: string, code: string, password?: string) => {
    setError(null);
    try {
      const res = await userForgetPassword(email, code, password);
      if (res.data?.success) {
        return res.data;
      }
      throw new Error(res.data?.message || "Password reset failed");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Password reset failed";
      console.error("Password reset error:", errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, []);

  const triggerToast = useCallback((message: string, type = 'success') => {
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
    error,
    updateUser
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
}
