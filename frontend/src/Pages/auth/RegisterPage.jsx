import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaShieldAlt,
  FaCloud,
  FaHistory,
  FaFileAlt,
} from "react-icons/fa";

import { HiOutlineMail } from "react-icons/hi";
import { FiLock, FiEye, FiUser } from "react-icons/fi";

import bgImage from "../assets/collab-bg.png";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-100 to-blue-300 p-3">
      <div className="bg-white rounded-[30px] shadow-2xl overflow-hidden min-h-[95vh] flex">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-blue-100 p-8 flex-col justify-center">

          <div>
            <div className="flex items-center gap-3">
              <FaFileAlt className="text-blue-500 text-4xl" />

              <h1 className="text-3xl font-bold text-slate-900">
                Collab
                <span className="text-blue-500">Docs</span>
              </h1>
            </div>

            <div className="w-12 h-1 bg-blue-500 mt-4 rounded-full"></div>
          </div>

          <div className="mt-8">
            <h1 className="text-[42px] font-bold leading-tight text-slate-900">
              Real-Time Collaborative
              <br />
              Document System
            </h1>

            <p className="mt-4 text-lg text-slate-500">
              Google Docs + Microsoft Word Inspired
              <br />
              with Secure Access Control
            </p>
          </div>

          <div className="flex justify-center mt-6">
            <img
              src={bgImage}
              alt="collaboration"
              className="max-w-[500px] w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">

            <div className="flex gap-3">
              <div className="bg-white p-3 rounded-full shadow">
                <FaUsers className="text-blue-500" />
              </div>

              <div>
                <h3 className="font-semibold text-sm">
                  Real-Time Collaboration
                </h3>

                <p className="text-xs text-gray-500">
                  Work together in real-time
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-white p-3 rounded-full shadow">
                <FaShieldAlt className="text-blue-500" />
              </div>

              <div>
                <h3 className="font-semibold text-sm">
                  Secure & Private
                </h3>

                <p className="text-xs text-gray-500">
                  JWT authentication
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-white p-3 rounded-full shadow">
                <FaCloud className="text-blue-500" />
              </div>

              <div>
                <h3 className="font-semibold text-sm">
                  Cloud Based
                </h3>

                <p className="text-xs text-gray-500">
                  Access anywhere
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-white p-3 rounded-full shadow">
                <FaHistory className="text-blue-500" />
              </div>

              <div>
                <h3 className="font-semibold text-sm">
                  Version History
                </h3>

                <p className="text-xs text-gray-500">
                  Restore versions
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-1/2 bg-gray-50 flex justify-center items-center p-6">

          <div className="bg-white w-full max-w-[560px] rounded-[30px] shadow-xl p-8">

            <h1 className="text-4xl font-bold text-center text-slate-900">
              Create Your Account
            </h1>

            <p className="text-center text-gray-500 mt-3 mb-8">
              Join CollabDocs and start collaborating
            </p>

            <form className="space-y-4">

              <div>
                <label className="font-medium">Full Name</label>

                <div className="relative mt-2">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full border border-gray-300 rounded-xl py-4 pl-12 pr-4"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium">Email Address</label>

                <div className="relative mt-2">
                  <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full border border-gray-300 rounded-xl py-4 pl-12 pr-4"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium">Password</label>

                <div className="relative mt-2">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="password"
                    placeholder="Create a password"
                    className="w-full border border-gray-300 rounded-xl py-4 pl-12 pr-12"
                  />

                  <FiEye className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="font-medium">
                  Confirm Password
                </label>

                <div className="relative mt-2">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="password"
                    placeholder="Confirm your password"
                    className="w-full border border-gray-300 rounded-xl py-4 pl-12 pr-12"
                  />

                  <FiEye className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="flex gap-2 text-sm">
                <input type="checkbox" />

                <p>
                  I agree to the{" "}
                  <span className="text-blue-600">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-blue-600">
                    Privacy Policy
                  </span>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 text-white font-semibold"
              >
                Create Account
              </button>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-[1px] bg-gray-300"></div>

                <span className="text-gray-400 text-sm">
                  OR CONTINUE WITH
                </span>

                <div className="flex-1 h-[1px] bg-gray-300"></div>
              </div>

              <button
                type="button"
                className="w-full border border-gray-300 rounded-xl py-4 flex justify-center items-center gap-3"
              >
                <FcGoogle size={24} />
                Continue with Google
              </button>

              <p className="text-center text-gray-500">
                Already have an account?

                <Link
                  to="/"
                  className="text-blue-600 font-semibold ml-1"
                >
                  Sign In
                </Link>
              </p>

            </form>

          </div>
        </div>

      </div>
    </div>
  );
}