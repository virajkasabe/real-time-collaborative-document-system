import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import verifyImage from "../../assets/verify-email.png";
import { useAuth } from "../../context/AuthContext";
import athenuraLogo from "../../assets/athenura-logo.png";
import { useTheme } from "../../context/ThemeContext";
import { HiOutlineMail } from 'react-icons/hi';
import { FiLock, FiShield, FiUsers, FiKey, FiClock, FiArrowLeft, FiSend } from 'react-icons/fi';

export default function EmailVerificationPage() {
<<<<<<< HEAD

  const { triggerToast, verifyEmail, error, verifyEmailRequest } = useAuth();

  const { verifyOTP, resendOTP, loading, error, devOTP, setVerificationToken, triggerToast } = useAuth();

=======
  const { triggerToast, verifyEmail, error, verifyEmailRequest } = useAuth();
>>>>>>> wind-breathing
  const { theme } = useTheme();
  const isDark = theme === 'dark' || document.documentElement.classList.contains('dark');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const token = location.state?.token || '';

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
<<<<<<< HEAD

  const [loading, setLoading] = useState(false);
  const [verificationError, setVerificationError] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (token) {
      setVerificationToken(token);
    }
  }, [token, setVerificationToken]);

  useEffect(() => {
    if (!email) navigate('/forgot-password');
  }, [email, navigate]);


=======
  const [loading, setLoading] = useState(false);
  const [verificationError, setVerificationError] = useState(null);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) navigate('/forgot-password');
  }, [email, navigate]);

>>>>>>> wind-breathing
  // Clear error when OTP changes
  useEffect(() => {
    setVerificationError(null);
  }, [otp]);

  const handleChange = (element, index) => {
    const val = element.value.replace(/[^0-9a-zA-Z]/g, "");
    if (!val) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

<<<<<<< HEAD
  const handleChange = (index, value) => {
    // Only allow single digit number
    if (!/^[0-9]$/.test(value) && value !== '') return;


    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
=======
    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    // Auto focus next input
    if (index < 5) {
>>>>>>> wind-breathing
      inputRefs.current[index + 1].focus();
    }
  };

<<<<<<< HEAD
  const handleKeyDown = (index, e) => {
=======
  const handleKeyDown = (e, index) => {
>>>>>>> wind-breathing
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
<<<<<<< HEAD

=======
>>>>>>> wind-breathing
    const text = e.clipboardData.getData("text").replace(/[^0-9a-zA-Z]/g, "").substring(0, 6);
    if (text.length === 6) {
      const newOtp = text.split("");
      setOtp(newOtp);
      inputRefs.current[5].focus();
    } else {
      triggerToast("Please paste a 6-digit verification code", "warning");
<<<<<<< HEAD

    const pasteData = e.clipboardData.getData('text').slice(0, 6);
    
    // Only allow if pasted value is all numbers
    if (!/^\d+$/.test(pasteData)) return;
    
    const newOtp = [...otp];
    pasteData.split('').forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    
    // Focus last filled input
    const lastIndex = Math.min(pasteData.length - 1, 5);
    if (inputRefs.current[lastIndex]) {
      inputRefs.current[lastIndex].focus();

=======
>>>>>>> wind-breathing
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
    if (isSubmitting) return;

    const code = otp.join("");

    if (code.length < 6) {
      triggerToast("Please enter complete 6-digit OTP", "error");
      return;
    }


=======
    const code = otp.join("");

    if (code.length < 6) {
      triggerToast("Please enter the full 6-digit code", "warning");
      return;
    }

>>>>>>> wind-breathing
    setLoading(true);
    setVerificationError(null);

    try {
      const result = await verifyEmail(email, code);
      
      if (result.success) {
        triggerToast("Verification code confirmed!", "success");
        navigate('/dashboard');
      } else {
        const errorMsg = result.error || "Invalid verification code. Please try again.";
        setVerificationError(errorMsg);
        triggerToast(errorMsg, "error");

        setOtp(["", "", "", "", "", ""]);
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }
    } catch (err) {
      const errorMsg = err.message || "Verification failed. Please try again.";
      setVerificationError(errorMsg);
      triggerToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async() => {
    await verifyEmailRequest(email)
    triggerToast("A new 6-digit code has been sent to " + email, "success");
    setOtp(["", "", "", "", "", ""]);
    setVerificationError(null);
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
<<<<<<< HEAD

    setIsSubmitting(true);
    try {
      const result = await verifyOTP(code);
      if (result && (result.success || result.statusCode < 400)) {
        navigate('/login');
      }
    } catch (err) {
      // Handled by context error state
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      const result = await resendOTP(email);
      if (result.success || result.statusCode < 400) {
        setOtp(["", "", "", "", "", ""]);
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }
    } catch (err) {
      // Handled by context error state

=======
>>>>>>> wind-breathing
    }
  };

  const features = [
    { icon: FiUsers, title: "Real-Time Collaboration", subtitle: "Work together with your team instantly" },
    { icon: FiShield, title: "Secure & Private", subtitle: "JWT auth & role-based access" },
    { icon: FiKey, title: "Role-Based Access", subtitle: "Control who can view, edit or share" },
    { icon: FiClock, title: "Version History", subtitle: "Track changes and restore history" }
  ];

  return (
    <div className="h-screen w-full overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-[#DBEAFE] to-[#C7D9F8] dark:from-[#090D16] dark:to-[#04060B] transition-colors duration-300 font-sans select-none">
      

      <div className="w-full max-w-6xl flex flex-col md:flex-row h-[92vh] max-h-[820px] rounded-2xl shadow-xl overflow-hidden bg-white dark:bg-[#0F172A]">


        <div className="hidden md:flex md:w-[48%] bg-gradient-to-br from-[#DBEAFE] to-[#C7D9F8] dark:from-[#161D2E] dark:to-[#1E2535] flex-col overflow-hidden p-8 transition-colors duration-300 relative self-stretch border-r border-slate-200/40 dark:border-r dark:border-gray-700/50">
          
  
          <div 
            className="absolute top-4 right-4 w-20 h-20 opacity-20 pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(#64748B 1.5px, transparent 1.5px)', backgroundSize: '10px 10px' }} 
          />
          <div 
            className="absolute bottom-4 left-4 w-20 h-20 opacity-20 pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(#64748B 1.5px, transparent 1.5px)', backgroundSize: '10px 10px' }} 
          />


          <div className="flex flex-col text-left relative z-10 shrink-0 mb-2">
            <div className="flex items-center gap-3">
              <img 
                src={athenuraLogo}
                alt="Athenura"
                className="h-10 w-auto object-contain"
                style={{ 
                  maxWidth: '160px',
                  filter: isDark ? 'brightness(10)' : 'brightness(0.2)',
                  opacity: '0.95'
                }}
              />
            </div>
            <div className="w-8 h-[3px] bg-[#2563EB] mt-1.5 rounded-full" />
          </div>


          <h1 className="text-2xl font-extrabold text-[#0F172A] dark:text-white mt-4 tracking-tight leading-snug text-left relative z-10 shrink-0">
            Verify Your Email Address
          </h1>


          <p className="text-sm text-[#475569] dark:text-gray-300 mt-2 leading-relaxed text-left relative z-10 shrink-0">
            Enter the 6-digit verification code to complete registration.
          </p>

          <div className="flex-1 flex items-center justify-center relative py-4 max-h-[200px] z-10">
            

            <div className="absolute left-2 top-8 w-24 h-10 bg-white/60 dark:bg-white/5 rounded-full blur-sm"/>
            <div className="absolute left-8 top-4 w-16 h-8 bg-white/40 dark:bg-white/5 rounded-full blur-sm"/>


            <div className="absolute top-2 right-16 z-20">
              <FiSend className="text-[#2563EB] text-3xl transform rotate-[30deg]"/>
              <svg className="absolute top-4 right-0 w-32 h-20 opacity-40" viewBox="0 0 100 60">
                <path d="M 90 5 Q 60 20 40 40 Q 20 55 10 58" stroke="#2563EB" strokeWidth="1.5" fill="none" strokeDasharray="5 4" strokeLinecap="round"/>
              </svg>
            </div>


            <div className="relative z-10">
              <div className="w-48 h-36 relative">
                

                <div className="w-full h-full bg-gradient-to-b from-[#4DA3FF] to-[#2563EB] rounded-2xl shadow-2xl shadow-blue-400/40 flex items-center justify-center">
                  
                  <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#3B9EFF] to-[#2563EB] rounded-xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016 A11.955 11.955 0 0112 2.944 a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9 c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052 -.382-3.016z"/>
                      </svg>
                    </div>
                  </div>
                </div>


                <div className="absolute -bottom-2 left-0 w-1/2 h-5 bg-[#1A54B8] rounded-bl-2xl transform skew-y-3"/>
                <div className="absolute -bottom-2 right-0 w-1/2 h-5 bg-[#2563EB] rounded-br-2xl transform -skew-y-3"/>
              </div>
            </div>
          </div>


          <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/50 dark:border-gray-700/30 mt-auto relative z-10 shrink-0 text-left">
            <div className="grid grid-cols-2 gap-3">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/70 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <feat.icon className="text-[#2563EB] dark:text-blue-400 text-xs" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A] dark:text-white leading-tight">
                      {feat.title}
                    </h4>
                    <p className="text-xs text-[#475569] dark:text-gray-400 leading-tight mt-0.5">
                      {feat.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-[52%] bg-white dark:bg-[#1A2235] flex flex-col justify-center overflow-hidden p-8 transition-colors duration-300 self-stretch">
          
          <div className="w-full max-w-[360px] mx-auto flex flex-col justify-center h-full select-text">

            {/* Mail icon circle */}
            <div className="relative w-14 h-14 bg-[#EBF4FF] dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3 shrink-0">
              <HiOutlineMail className="text-[#2563EB] dark:text-blue-400 text-2xl" />
              <FiLock className="text-[#2563EB] dark:text-blue-400 text-[10px] absolute -bottom-0.5 -right-0.5 bg-white dark:bg-[#1A2235] rounded-full p-0.5 shadow-sm border border-slate-100 dark:border-slate-700" />
            </div>

            {/* Heading */}
            <h2 className="text-2xl font-extrabold text-[#0F172A] dark:text-white text-center mb-1 shrink-0">
              Email Verification
            </h2>

            {/* Error Display */}
            {(verificationError || error) && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400 text-center">
                  {verificationError || error || error?.message}
                </p>
              </div>
            )}

            {/* Subtext */}
            <p className="text-sm text-[#64748B] dark:text-gray-400 text-center mt-2 mb-4 leading-relaxed shrink-0">
              Enter the 6-digit verification code
              <br />
              sent to: <span className="text-sm font-semibold text-[#2563EB] dark:text-blue-400">{email}</span>
            </p>

            {/* OTP BOXES */}
            <form onSubmit={handleVerify} className="shrink-0">
              <div className="flex justify-center gap-2 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    maxLength={1}
                    type="text"
                    inputMode="numeric"
                    value={digit}
<<<<<<< HEAD
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
=======
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
>>>>>>> wind-breathing
                    onPaste={handlePaste}
                    className="w-11 h-11 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-center text-lg font-bold bg-white dark:bg-[#2D3748] text-[#0F172A] dark:text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-colors"
                    disabled={loading}
                  />
                ))}
              </div>

              {/* Verify Code Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 rounded-xl bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-all duration-200 cursor-pointer flex items-center justify-center shadow-md shadow-blue-500/10 hover:shadow-blue-500/20"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : "Verify Code"}
              </button>
            </form>

<<<<<<< HEAD
            {/* Error Message */}
            {error && (
              <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>
                ⚠️ {error}
              </p>
            )}

            {/* Show OTP on UI for testing (REMOVE IN PRODUCTION) */}
            {devOTP && (
              <div style={{
                background: '#fff3cd',
                border: '1px solid #ffc107',
                padding: '10px',
                borderRadius: '8px',
                marginTop: '10px',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0, fontSize: '14px', color: '#856404' }}>
                  🔐 Development OTP (email disabled):
                </p>
                <h2 style={{ margin: '5px 0', color: '#333', letterSpacing: '4px' }} className="font-extrabold">
                  {devOTP}
                </h2>
              </div>
            )}

=======
>>>>>>> wind-breathing
            {/* Back to Login */}
            <Link
              to="/login"
              className="text-[#2563EB] dark:text-blue-400 font-semibold text-sm mt-3 flex items-center justify-center gap-1 hover:underline cursor-pointer shrink-0"
            >
              <FiArrowLeft className="text-lg" />
              Back to Login
            </Link>

            {/* Resend Paragraph */}
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium shrink-0">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="text-[#2563EB] dark:text-blue-400 font-bold hover:underline focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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