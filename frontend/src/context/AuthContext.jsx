import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Sync user state from localStorage on startup
  useEffect(() => {
    const savedUser = localStorage.getItem('collabdocs_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const login = async (email, password) => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simple validation
    if (!email || !password) {
      triggerToast('Please fill in all fields', 'warning');
      setLoading(false);
      return false;
    }

    if (password.length < 4) {
      triggerToast('Password must be at least 4 characters', 'warning');
      setLoading(false);
      return false;
    }

    const mockUser = {
      email,
      name: email.split('@')[0].toUpperCase(),
      role: 'Admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop'
    };

    localStorage.setItem('collabdocs_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsAuthenticated(true);
    triggerToast('Logged in successfully', 'success');
    setLoading(false);
    return true;
  };

  const register = async (email, name, password) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!email || !name || !password) {
      triggerToast('All fields are required', 'warning');
      setLoading(false);
      return false;
    }

    const mockUser = {
      email,
      name: name.toUpperCase(),
      role: 'Editor',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
    };

    localStorage.setItem('collabdocs_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsAuthenticated(true);
    triggerToast('Account created successfully', 'success');
    setLoading(false);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('collabdocs_user');
    setUser(null);
    setIsAuthenticated(false);
    triggerToast('Logged out successfully', 'info');
  };

  const forgotPassword = async (email) => {
    if (!email) {
      triggerToast('Please provide a valid email', 'warning');
      return false;
    }
    triggerToast('Password reset code sent to your email!', 'success');
    return true;
  };

  const resetPassword = async (email, code, newPassword) => {
    if (!email || !code || !newPassword) {
      triggerToast('Please complete all form fields', 'warning');
      return false;
    }
    triggerToast('Password has been reset successfully!', 'success');
    return true;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      register,
      logout,
      forgotPassword,
      resetPassword,
      toast,
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
