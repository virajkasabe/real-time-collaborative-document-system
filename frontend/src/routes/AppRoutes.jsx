import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from '../pages/landing/Landing';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import EmailVerificationPage from '../pages/auth/EmailVerificationPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import Dashboard from '../pages/dashboard/Dashboard';
import Documents from '../pages/dashboard/Documents';
import SharedDocuments from '../pages/dashboard/SharedDocuments';
import EditingPage from '../pages/EditingPage';
import Profile from '../pages/profile/Profile';
import Settings from '../pages/profile/Settings';
import ResetPassword from '../pages/profile/ResetPassword';
import NotificationsPage from '../pages/NotificationsPage';


import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import ToastNotification from '../components/notifications/ToastNotification';
import AboutUs from '../pages/About';
import ContactUs from '../pages/Contact';
import HelpPage from '../pages/Help';

const DashboardLayout = ({ children }) => {
  return (
    <>
      <ToastNotification />
      {children}
    </>
  );
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-email/" element={<EmailVerificationPage />} />
      <Route path="/set-new-password" element={<ResetPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route element={
        <ProtectedRoute>
          <DashboardLayout>
            <Layout />
          </DashboardLayout>
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/shared" element={<SharedDocuments />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>
      

      <Route path="/editor/:id" element={
        <ProtectedRoute>
          <DashboardLayout>
            <EditingPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
