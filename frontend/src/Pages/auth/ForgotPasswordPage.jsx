import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMail } from "react-icons/hi";

import forgotImage from "../assets/forgot-password.png";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-100 to-blue-400 flex items-center justify-center p-4">

      <div className="w-full max-w-[1500px] h-[95vh] bg-white rounded-[30px] shadow-2xl overflow-hidden flex">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-50 to-blue-100 flex-col justify-center items-center p-10">

          <div className="w-full max-w-[550px]">
            <h1 className="text-3xl font-bold text-blue-600">
              CollabDocs
            </h1>

            <h2 className="text-5xl font-bold text-slate-900 mt-10 leading-tight">
              Secure Your Account
              <br />
              Reset with Ease
            </h2>

            <p className="text-gray-600 mt-5 text-lg">
              Don't worry! It happens to the best of us.
              <br />
              We'll help you get back into your account.
            </p>
          </div>

          <img
            src={forgotImage}
            alt="Forgot Password"
            className="w-[500px] mt-10"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-1/2 bg-gray-50 flex items-center justify-center p-8">

          <div className="bg-white w-full max-w-[520px] rounded-[30px] shadow-xl p-10">

            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                <HiOutlineMail className="text-5xl text-blue-600" />
              </div>
            </div>

            <h1 className="text-5xl font-bold text-center mt-6">
              Forgot Password?
            </h1>

            <p className="text-center text-gray-500 mt-4 mb-8">
              Enter your email address and we'll send you
              instructions to reset your password.
            </p>

            <form className="space-y-5">

              <div>
                <label className="font-medium">
                  Email Address
                </label>

                <div className="relative mt-2">
                  <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />

                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full border border-gray-300 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 text-white font-semibold text-xl"
              >
                Send Reset Link
              </button>

              <div className="flex items-center gap-4">
                <div className="h-[1px] bg-gray-300 flex-1"></div>
                <span className="text-gray-400 text-sm">OR</span>
                <div className="h-[1px] bg-gray-300 flex-1"></div>
              </div>

              <button
                type="button"
                className="w-full border border-gray-300 rounded-xl py-4 flex justify-center items-center gap-3 hover:bg-gray-50"
              >
                <FcGoogle size={25} />
                Continue with Google
              </button>

              <p className="text-center">
                <Link
                  to="/"
                  className="text-blue-600 font-semibold"
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