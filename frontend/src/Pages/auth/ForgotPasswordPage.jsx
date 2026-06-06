import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMail } from "react-icons/hi";
import forgotImage from "../../assets/forgot-password.png";
import { useAuth } from "../../context/AuthContext";
import { BRAND_NAME } from "../../utils/constants";

export default function ForgotPasswordPage() {
  const { forgotPassword, login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email address is required");
      return;
    }

    setLoading(true);
    const success = await forgotPassword(email.trim());
    setLoading(false);

    if (success) {
      navigate('/verify-email', { state: { email: email.trim() } });
    }
  };

  const handleGoogleRecovery = async () => {
    setLoading(true);
    const success = await login('google.user@company.com', 'password');
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div 
      style={{ 
        fontFamily: 'Inter, "SF Pro Display", "Segoe UI", sans-serif',
        background: 'linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%)'
      }}
      className="min-h-screen flex items-center justify-center p-4 lg:p-6 relative overflow-y-auto font-sans"
    >
      {/* Subtle decorative blue blur shapes in background */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#2563EB]/8 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card - 50/50 split layout, vertically centered columns on desktop, flex-col-reverse order-swapped on mobile/tablet */}
      <div className="forgot-page-container z-10 flex flex-col-reverse lg:flex-row my-auto">

        {/* LEFT SIDE: Branding Panel (50% Width, vertically centered internally) */}
        <div className="flex w-full lg:w-1/2 bg-gradient-to-br from-blue-50 to-blue-100 flex-col justify-center items-center p-6 lg:py-6 lg:px-10 xl:py-8 xl:px-12 select-none">
          <div className="w-full max-w-[500px] text-left flex flex-col gap-y-[clamp(20px,2.5vh,32px)]">
            {/* Logo */}
            <div className="pt-3 pl-2">
              <h1 className="text-3xl font-bold text-blue-600">
                {BRAND_NAME}
              </h1>
            </div>
            
            {/* Heading and Description with spacing system */}
            <h2 className="forgot-hero-heading leading-tight">
              Secure Your Account
              <br />
              Reset with Ease
            </h2>
            <p className="forgot-hero-description">
              Don't worry! It happens to the best of us.
              <br />
              We'll help you get back into your account.
            </p>

            {/* Illustration with responsive spacing and scaling */}
            <div className="flex justify-center items-center w-full">
              <img
                src={forgotImage}
                alt="Forgot Password"
                className="forgot-hero-illustration object-contain"
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Form card (50% Width, vertically centered) */}
        <div className="w-full lg:w-1/2 bg-gray-50/50 flex items-center justify-center p-6 lg:py-6 lg:px-10 xl:py-8 xl:px-12">
          <div className="forgot-card-wrapper text-left">

            {/* Icon header centered */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-blue-100/80 flex items-center justify-center">
                <HiOutlineMail className="text-4xl text-blue-600" />
              </div>
            </div>

            {/* Typography clamp title and description */}
            <h1 className="forgot-form-title text-center mt-[16px]">
              Forgot Password?
            </h1>
            <p className="text-center text-slate-500 text-sm font-medium mt-[16px] mb-[24px]">
              Enter your email address and we'll send you
              instructions to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Input field with spacing system */}
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Email Address
                </label>
                <div className="relative mt-[8px]">
                  <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full h-[52px] border ${error ? 'border-red-500 focus:ring-red-500/10 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500/10 focus:border-blue-500'} rounded-xl pl-12 pr-4 focus:outline-none focus:ring-4 text-[16px] font-medium transition-all duration-150 bg-white`}
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">{error}</p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[52px] rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 text-white font-semibold text-base hover:from-sky-500 hover:to-blue-700 transition duration-200 shadow-md shadow-blue-500/20 disabled:opacity-50 mt-[16px] cursor-pointer"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              {/* Divider spacing */}
              <div className="flex items-center gap-4 mt-[16px]">
                <div className="h-[1px] bg-gray-300 flex-1"></div>
                <span className="text-gray-400 text-sm font-medium">OR</span>
                <div className="h-[1px] bg-gray-300 flex-1"></div>
              </div>

              {/* Google recovery button */}
              <button
                type="button"
                onClick={handleGoogleRecovery}
                disabled={loading}
                className="w-full h-[52px] border border-gray-300 rounded-xl flex justify-center items-center gap-3 hover:bg-gray-50 transition duration-150 font-semibold text-slate-700 mt-[16px] cursor-pointer"
              >
                <FcGoogle size={22} />
                Continue with Google
              </button>

              {/* Back link */}
              <p className="text-center mt-[16px] font-medium text-sm">
                <Link
                  to="/login"
                  className="text-blue-600 hover:underline inline-flex items-center"
                >
                  ← Back to Login
                </Link>
              </p>

            </form>

          </div>
        </div>

      </div>
    </div>
  );
}