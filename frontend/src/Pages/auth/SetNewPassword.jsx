import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import bgImage from "../../assets/SET-PASSWORD.png";
import { useAuth } from "../../context/AuthContext";

export default function SetNewPassword() {
  const { resetPassword, isAuthenticated, triggerToast, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const code = location.state?.code;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!email || !code) {
      triggerToast("Missing security validation. Please request a new link.", "warning");
      navigate('/forgot-password');
    }
  }, [email, code, navigate, triggerToast]);

  // Real-time rules checklist validations
  const ruleLength = password.length >= 8;
  const ruleCasing = /[A-Z]/.test(password) && /[a-z]/.test(password);
  const ruleNumber = /[0-9]/.test(password);
  const ruleSpecial = /[^A-Za-z0-9]/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    let errs = {};

    if (!password) {
      errs.password = "Password is required";
    } else if (!ruleLength || !ruleCasing || !ruleNumber || !ruleSpecial) {
      errs.password = "Password does not meet all security requirements";
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      if (errs.password) {
        triggerToast(errs.password, "warning");
      } else if (errs.confirmPassword) {
        triggerToast(errs.confirmPassword, "warning");
      }
      return;
    }

    setLoading(true);
    const success = await resetPassword(email, code, password);
    setLoading(false);

    if (success) {
      triggerToast("Your password has been updated. Please sign in.", "success");
      navigate('/login');
    }
  };

  const handleGoogleMock = async () => {
    setLoading(true);
    const success = await login('google.user@company.com', 'password');
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="h-screen bg-[#dcecff] flex items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-[1400px] h-[95vh] rounded-[30px] overflow-hidden">

        {/* Background Image */}
        <img
          src={bgImage}
          alt="Set Password"
          className="w-full h-full object-cover"
        />

        {/* Right Side Form */}
        <div className="absolute inset-0 flex justify-end items-center pr-[11%]">
          <div className="w-[450px] bg-white rounded-[30px] shadow-2xl p-8 text-left border border-slate-100">

            {/* Lock Icon */}
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                🔒
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-3xl font-bold text-center text-[#0f172a]">
              Set New Password
            </h1>
            <p className="text-center text-gray-500 mt-2 mb-6">
              Enter your new password below for:
              <br />
              <span className="font-semibold text-slate-600">{email}</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full border ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Rules Checklist */}
              <div className="mt-5 space-y-2 text-xs text-gray-600 font-medium">
                <p className={ruleLength ? "text-emerald-600" : "text-gray-500"}>
                  {ruleLength ? "✅" : "❌"} At least 8 characters long
                </p>
                <p className={ruleCasing ? "text-emerald-600" : "text-gray-500"}>
                  {ruleCasing ? "✅" : "❌"} Include uppercase & lowercase letters
                </p>
                <p className={ruleNumber ? "text-emerald-600" : "text-gray-500"}>
                  {ruleNumber ? "✅" : "❌"} Include at least one number
                </p>
                <p className={ruleSpecial ? "text-emerald-600" : "text-gray-500"}>
                  {ruleSpecial ? "✅" : "❌"} Include at least one special character
                </p>
              </div>

              {/* Update Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition duration-150 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-500 text-sm font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Google Button */}
            <button
              onClick={handleGoogleMock}
              disabled={loading}
              className="w-full border border-gray-300 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition duration-150 font-medium text-slate-700"
            >
              <FcGoogle size={22} />
              Continue with Google
            </button>

            {/* Back to Login */}
            <div className="text-center mt-5 font-semibold text-sm">
              <Link
                to="/login"
                className="text-blue-600 hover:underline inline-flex items-center"
              >
                ← Back to Login
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}