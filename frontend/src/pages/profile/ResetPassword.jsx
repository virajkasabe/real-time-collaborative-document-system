import React, { useState } from 'react';
<<<<<<< HEAD
import { useNavigate, useParams } from 'react-router-dom';
import { FiLock, FiEye, FiEyeOff, FiCheckCircle, FiCircle } from 'react-icons/fi';
import { Check, X } from 'lucide-react';
import Button from '../../components/common/Button';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { unHashedToken } = useParams();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

=======
import { useNavigate } from 'react-router-dom';
import { FiLock, FiEye, FiEyeOff, FiCheckCircle, FiCircle } from 'react-icons/fi';
import { Check, X } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export default function ResetPassword() {
  const { user, triggerToast } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
>>>>>>> wind-breathing
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Requirements checklist
  const requirements = [
    { label: 'Minimum 8 characters', test: newPassword.length >= 8 },
    { label: 'One uppercase letter', test: /[A-Z]/.test(newPassword) },
    { label: 'One lowercase letter', test: /[a-z]/.test(newPassword) },
    { label: 'One number', test: /[0-9]/.test(newPassword) },
    { label: 'One special character', test: /[^A-Za-z0-9]/.test(newPassword) },
  ];

  const getStrengthLevel = () => {
    let score = 0;
    if (newPassword.length >= 8) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;
    return score;
  };

  const getStrengthLabel = () => {
    const level = getStrengthLevel();
    if (!newPassword) return '';
    if (level === 1) return 'Weak';
    if (level === 2) return 'Fair';
    if (level === 3) return 'Good';
    if (level === 4) return 'Strong';
    return '';
  };

  const getStrengthColor = (level) => {
    const currentLevel = getStrengthLevel();
    if (currentLevel < level) return 'bg-gray-200 dark:bg-gray-800';
    if (currentLevel === 1) return 'bg-red-500';
    if (currentLevel === 2) return 'bg-orange-500';
    if (currentLevel === 3) return 'bg-yellow-500';
    if (currentLevel === 4) return 'bg-green-500';
    return 'bg-gray-200 dark:bg-gray-800';
  };

  const getStrengthTextColor = () => {
    const level = getStrengthLevel();
    if (level === 1) return 'text-red-500';
    if (level === 2) return 'text-orange-500';
    if (level === 3) return 'text-yellow-600 dark:text-yellow-500';
    if (level === 4) return 'text-green-500';
    return 'text-gray-400';
  };

  const canSubmit = 
<<<<<<< HEAD
    newPassword && 
    confirmPassword && 
    newPassword === confirmPassword && 
    requirements.every(req => req.test);
=======
    currentPassword && 
    newPassword && 
    confirmPassword && 
    newPassword === confirmPassword && 
    getStrengthLevel() >= 2;
>>>>>>> wind-breathing

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setErrors({});
    let errs = {};

<<<<<<< HEAD
    if (!newPassword) {
      errs.newPassword = 'Password is required';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Confirm password is required';
=======
    if (!currentPassword) {
      errs.currentPassword = 'Current password is required';
    }

    const meetsRequirements = requirements.every(req => req.test);
    if (!newPassword) {
      errs.newPassword = 'New password is required';
    } else if (!meetsRequirements) {
      errs.newPassword = 'Password does not meet all security requirements';
>>>>>>> wind-breathing
    }

    if (newPassword !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

<<<<<<< HEAD
    const meetsRequirements = requirements.every(req => req.test);
    if (newPassword && !meetsRequirements) {
      errs.newPassword = 'Password does not meet all security requirements';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstError = Object.values(errs)[0];
      toast.error(firstError);
      return;
    }

    if (!unHashedToken) {
      toast.error('Reset token is missing from the URL');
=======
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      if (errs.currentPassword) triggerToast(errs.currentPassword, 'warning');
      else if (errs.newPassword) triggerToast(errs.newPassword, 'warning');
      else if (errs.confirmPassword) triggerToast(errs.confirmPassword, 'warning');
>>>>>>> wind-breathing
      return;
    }

    setLoading(true);

<<<<<<< HEAD
    try {
      const response = await axios.post(
        `http://localhost:5000/api/v1/rtcds/auth/reset-password/${unHashedToken}`,
        {
          newPassword,
          confirmPassword
        }
      );

      toast.success(response.data?.message || 'Password reset successful!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to reset password. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
=======
    /* 
      API Integration Structure Preparation:
      try {
        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            currentPassword,
            newPassword
          })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error updating password');
        
        triggerToast('Password updated successfully', 'success');
        navigate('/profile');
      } catch (error) {
        triggerToast(error.message, 'danger');
      }
    */

    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);

    triggerToast('Password updated successfully', 'success');
    navigate('/profile');
>>>>>>> wind-breathing
  };

  return (
    <div className="p-6 space-y-6 max-w-xl w-full mx-auto select-none">
<<<<<<< HEAD
      <Toaster position="top-center" reverseOrder={false} />
      
=======
>>>>>>> wind-breathing
      {/* Header */}
      <div className="border-b border-[#E5E7EB] dark:border-white/10 pb-5 transition-all duration-300 text-left">
        <h2 className="font-sans font-extrabold text-xl md:text-2xl text-[#081B3A] dark:text-white tracking-tight">
          Reset Password
        </h2>
        <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] font-medium mt-1">
          Update your account password securely
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/5 rounded-[20px] p-6 shadow-sm transition-all duration-300">
        <form onSubmit={handleUpdatePassword} className="space-y-4 text-left">
          
<<<<<<< HEAD
=======
          {/* Current Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider block">
              Current Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]/60 dark:text-[#94A3B8]/60 text-sm z-10" />
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`w-full h-[38px] pl-9 pr-10 text-xs rounded-lg border bg-white dark:bg-[#070B14] text-[#081B3A] dark:text-[#E5E7EB] placeholder-[#6B7280]/40 dark:placeholder-[#94A3B8]/40 focus:outline-none focus:ring-1 focus:ring-[#0D6EFD] focus:border-[#0D6EFD] shadow-sm transition-all duration-300 ${
                  errors.currentPassword ? 'border-rose-500 focus:ring-rose-500' : 'border-[#E5E7EB] dark:border-white/10 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-650 dark:hover:text-white transition duration-150 z-10"
              >
                {showCurrentPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
              </button>
            </div>
            {errors.currentPassword && (
              <span className="text-[9px] font-semibold text-rose-500 mt-0.5 ml-0.5 block">{errors.currentPassword}</span>
            )}
          </div>

>>>>>>> wind-breathing
          {/* New Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider block">
              New Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]/60 dark:text-[#94A3B8]/60 text-sm z-10" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full h-[38px] pl-9 pr-10 text-xs rounded-lg border bg-white dark:bg-[#070B14] text-[#081B3A] dark:text-[#E5E7EB] placeholder-[#6B7280]/40 dark:placeholder-[#94A3B8]/40 focus:outline-none focus:ring-1 focus:ring-[#0D6EFD] focus:border-[#0D6EFD] shadow-sm transition-all duration-300 ${
                  errors.newPassword ? 'border-rose-500 focus:ring-rose-500' : 'border-[#E5E7EB] dark:border-white/10 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-650 dark:hover:text-white transition duration-150 z-10"
              >
                {showNewPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
              </button>
            </div>
            {newPassword.length > 0 && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4].map(level => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          getStrengthColor(level)
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-[10px] font-bold ${getStrengthTextColor()}`}>
                    {getStrengthLabel()}
                  </span>
                </div>
              </div>
            )}
            {errors.newPassword && (
              <span className="text-[9px] font-semibold text-rose-500 mt-0.5 ml-0.5 block">{errors.newPassword}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider block">
              Confirm New Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]/60 dark:text-[#94A3B8]/60 text-sm z-10" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full h-[38px] pl-9 pr-10 text-xs rounded-lg border bg-white dark:bg-[#070B14] text-[#081B3A] dark:text-[#E5E7EB] placeholder-[#6B7280]/40 dark:placeholder-[#94A3B8]/40 focus:outline-none focus:ring-1 focus:ring-[#0D6EFD] focus:border-[#0D6EFD] shadow-sm transition-all duration-300 ${
                  errors.confirmPassword ? 'border-rose-500 focus:ring-rose-500' : 'border-[#E5E7EB] dark:border-white/10 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-650 dark:hover:text-white transition duration-150 z-10"
              >
                {showConfirmPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-[9px] font-semibold text-rose-500 mt-0.5 ml-0.5 block">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Requirements Checklist */}
          <div className="space-y-1.5 pt-4 border-t border-[#E5E7EB]/50 dark:border-white/5">
            <p className="text-[10px] font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
              Password Requirements:
            </p>
            {requirements.map((req, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                {req.test ? (
                  <FiCheckCircle className="text-emerald-500 flex-shrink-0" size={14} />
                ) : (
                  <FiCircle className="text-gray-300 dark:text-gray-700 flex-shrink-0" size={14} />
                )}
                <span className={req.test ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-[#6B7280] dark:text-[#94A3B8]'}>
                  {req.label}
                </span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex justify-end gap-2 border-t border-[#E5E7EB]/50 dark:border-white/5 mt-4">
<<<<<<< HEAD
            <Button variant="outline" onClick={() => navigate('/login')} icon={X}>
=======
            <Button variant="outline" onClick={() => navigate('/profile')} icon={X}>
>>>>>>> wind-breathing
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading || !canSubmit} loading={loading} icon={Check}>
              Update Password
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
