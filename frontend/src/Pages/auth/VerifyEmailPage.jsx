import { Link } from "react-router-dom";
import verifyImage from "../assets/verify-email.png";

export default function VerifyEmailPage() {
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

          <div className="bg-white w-full max-w-[590px] rounded-[30px] shadow-xl p-9">

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
              sent to your email address.
            </p>

            {/* OTP BOXES */}
            <div className="flex justify-center gap-3 mb-8">

              {[1, 2, 3, 4, 5, 6].map((item) => (
                <input
                  key={item}
                  maxLength={1}
                  type="text"
                  className="w-16 h-16 border-2 border-gray-300 rounded-xl text-center text-2xl focus:border-blue-500 focus:outline-none"
                />
              ))}

            </div>

            {/* BUTTON */}
            <button
              className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 text-white font-semibold text-2xl"
            >
              Verify Code
            </button>

            {/* DIVIDER */}
            <div className="flex items-center gap-4 my-8">

              <div className="flex-1 h-[1px] bg-gray-300"></div>

              <span className="text-gray-500">
                or
              </span>

              <div className="flex-1 h-[1px] bg-gray-300"></div>

            </div>

            {/* BACK */}
            <div className="text-center">

              <Link
                to="/"
                className="text-blue-600 font-medium text-lg"
              >
                ← Back to Login
              </Link>

            </div>

            {/* RESEND */}
            <p className="text-center text-gray-500 mt-8">

              Didn't receive the code?

              <button
                type="button"
                className="text-blue-600 font-semibold ml-2"
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