import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages imports
import Landing from '../pages/landing/Landing';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import Dashboard from '../pages/dashboard/Dashboard';
import Documents from '../pages/dashboard/Documents';
import SharedDocuments from '../pages/dashboard/SharedDocuments';
import Editor from '../pages/editor/Editor';
import Profile from '../pages/profile/Profile';
import Settings from '../pages/profile/Settings';

// Protected Route boundary
import ProtectedRoute from '../components/layout/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Secure Authenticated Pages */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/documents" element={
        <ProtectedRoute>
          <Documents />
        </ProtectedRoute>
      } />
      
      <Route path="/shared" element={
        <ProtectedRoute>
          <SharedDocuments />
        </ProtectedRoute>
      } />
      
      <Route path="/editor/:id" element={
        <ProtectedRoute>
          <Editor />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />

      {/* Fallback Catch-all redirects to Landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
