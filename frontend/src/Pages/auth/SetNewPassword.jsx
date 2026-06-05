import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import bgImage from "../assets/SET-PASSWORD.png";

export default function SetNewPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="h-screen bg-[#dcecff] flex items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-[1400px] h-[95vh]">

        {/* Background Image */}
        <img
          src={bgImage}
          alt="Set Password"
          className="w-full h-full object-contain"
        />

        {/* Right Side Form */}
        <div className="absolute inset-0 flex justify-end items-center pr-[11%]">
          <div className="w-[450px] bg-white rounded-[30px] shadow-lg p-6">

            {/* Lock Icon */}
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-2xl">
                🔒
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-3xl font-bold text-center text-[#0f172a]">
              Set New Password
            </h1>

            <p className="text-center text-gray-500 mt-2 mb-6">
              Enter your new password below.
            </p>

            {/* New Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                New Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showConfirm ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Rules */}
            <div className="mt-5 space-y-2 text-sm text-gray-600">
              <p>✅ At least 8 characters long</p>
              <p>✅ Include uppercase & lowercase letters</p>
              <p>✅ Include at least one number</p>
              <p>✅ Include at least one special character</p>
            </div>

            {/* Update Button */}
            <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold">
              Update Password
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-500 text-sm">OR</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Google Button */}
            <button className="w-full border border-gray-300 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50">
              <FcGoogle size={22} />
              Continue with Google
            </button>

            {/* Back */}
            <div className="text-center mt-5">
              <button className="text-blue-600 font-medium">
                ← Back to Login
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}