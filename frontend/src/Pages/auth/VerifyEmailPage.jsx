import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import verifyImage from "../../assets/verify-email.png";
import { useAuth } from "../../context/AuthContext";

export default function VerifyEmailPage() {
  const { triggerToast, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      triggerToast("Please provide your email to receive a code first", "warning");
      navigate('/forgot-password');
    }
  }, [email, navigate, triggerToast]);

  const handleChange = (element, index) => {
    const val = element.value.replace(/[^0-9]/g, ""); // Allow only digits
    if (!val) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    // Auto focus next input
    if (index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/[^0-9]/g, "").substring(0, 6);
    if (text.length === 6) {
      const newOtp = text.split("");
      setOtp(newOtp);
      inputRefs.current[5].focus();
    } else {
      triggerToast("Please paste a 6-digit number code", "warning");
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length < 6) {
      triggerToast("Please enter the full 6-digit code", "warning");
      return;
    }

    setLoading(true);
    // Simulate short network delay for verification
    setTimeout(() => {
      setLoading(false);
      triggerToast("Verification code confirmed!", "success");
      // Navigate to setNewPassword screen with the email and code
      navigate('/set-new-password', { state: { email, code } });
    }, 600);
  };

  const handleResend = () => {
    triggerToast("A new 6-digit code has been sent to " + email, "success");
    setOtp(["", "", "", "", "", ""]);
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-r from-sky-100 to-blue-400 p-4">
      <div className="h-full bg-white rounded-[30px] shadow-2xl overflow-hidden flex">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex lg:w-[60%] bg-[#edf5ff] items-center justify-end pr-3">
          <img
            src={verifyImage}
            alt="Verify Email"
            className="w-[92%] h-[92%] object-contain"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-[55%] bg-[#fafafa] flex items-center justify-center px-8">
          <div className="bg-white w-full max-w-[590px] rounded-[30px] shadow-xl p-9 text-left">

            {/* ICON */}
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            {/* HEADING */}
            <h1 className="text-center text-5xl font-bold text-slate-900 mt-8">
              Email Verification
            </h1>
            <p className="text-center text-gray-500 mt-4 mb-10 text-lg">
              Enter the 6-digit verification code
              <br />
              sent to your email address:
              <br />
              <span className="font-semibold text-slate-700">{email}</span>
            </p>

            {/* OTP BOXES */}
            <form onSubmit={handleVerify}>
              <div className="flex justify-center gap-3 mb-8">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    maxLength={1}
                    type="text"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className="w-14 h-14 sm:w-16 sm:h-16 border-2 border-gray-300 rounded-xl text-center text-2xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold"
                  />
                ))}
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 text-white font-semibold text-2xl hover:from-sky-500 hover:to-blue-700 transition duration-200 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </form>

            {/* DIVIDER */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-[1px] bg-gray-300"></div>
              <span className="text-gray-500">or</span>
              <div className="flex-1 h-[1px] bg-gray-300"></div>
            </div>

            {/* BACK TO LOGIN */}
            <div className="text-center">
              <Link
                to="/login"
                className="text-blue-600 font-medium text-lg hover:underline"
              >
                ← Back to Login
              </Link>
            </div>

            {/* RESEND */}
            <p className="text-center text-gray-500 mt-8 text-base">
              Didn't receive the code?
              <button
                type="button"
                onClick={handleResend}
                className="text-blue-600 font-semibold ml-2 hover:underline focus:outline-none"
              >
                Resend Code
              </button>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}