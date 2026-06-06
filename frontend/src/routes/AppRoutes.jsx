import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages imports
import Landing from '../pages/landing/Landing';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage';
import SetNewPassword from '../pages/auth/SetNewPassword';
import Dashboard from '../pages/dashboard/Dashboard';
import Documents from '../pages/dashboard/Documents';
import SharedDocuments from '../pages/dashboard/SharedDocuments';
import EditingPage from '../pages/EditingPage';
import Profile from '../pages/profile/Profile';
import Settings from '../pages/profile/Settings';

// Layout and Protected Route
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/layout/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/set-new-password" element={<SetNewPassword />} />

      {/* Secure Authenticated Pages wrapped in Layout */}
      <Route element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/shared" element={<SharedDocuments />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      
      {/* Standalone Editor Route for immersive editing */}
      <Route path="/editor/:id" element={
        <ProtectedRoute>
          <EditingPage />
        </ProtectedRoute>
      } />

      {/* Fallback Catch-all redirects to Landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
