// import { FcGoogle } from "react-icons/fc";
// import {
//   FaUsers,
//   FaShieldAlt,
//   FaCloud,
//   FaHistory,
//   FaFileAlt,
// } from "react-icons/fa";

// import { HiOutlineMail } from "react-icons/hi";
// import { FiLock, FiEye } from "react-icons/fi";

// import bgImage from "../assets/collab-bg.png";

// export default function LoginPage() {
//   return (
    
  
//   <div className="min-h-screen bg-gradient-to-r from-sky-100 to-blue-400 p-4 lg:p-6">
//      <div className="bg-white rounded-[30px] overflow-hidden shadow-2xl min-h-[95vh] flex">
//         {/* LEFT SIDE */}

//         <div className="hidden lg:flex lg:w-1/2 flex-col bg-gradient-to-br from-slate-50 to-blue-100 p-12">

//           {/* Logo */}
//           <div>
//             <div className="flex items-center gap-4">
//               <FaFileAlt className="text-blue-500 text-5xl" />

//               <h1 className="text-5xl font-bold text-slate-900">
//                 Collab
//                 <span className="text-blue-500">
//                   Docs
//                 </span>
//               </h1>
//             </div>

//             <div className="w-16 h-1 bg-blue-500 mt-6 rounded-full"></div>
//           </div>

//           {/* Heading */}

//           <div className="mt-10">
//             <h1 className="text-[55px] font-bold leading-tight text-slate-900">
//               Real-Time Collaborative
//               <br />
//               Document System
//             </h1>

//             <p className="mt-5 text-2xl text-slate-500 leading-relaxed">
//               Google Docs + Microsoft Word Inspired
//               <br />
//               with Secure Access Control
//             </p>
//           </div>

//           {/* Image */}

//           <div className="flex justify-center mt-10">
//             <img
//               src={bgImage}
//               alt="collaboration"
//               className="w-full max-w-[650px]"
//             />
//           </div>

//           {/* Features */}

//           <div className="grid grid-cols-1 gap-6 mt-8">

//             <div className="flex items-center gap-4">
//               <div className="bg-white shadow-lg p-4 rounded-full">
//                 <FaUsers className="text-blue-500 text-xl" />
//               </div>

//               <div>
//                 <h3 className="font-semibold text-lg">
//                   Real-Time Collaboration
//                 </h3>

//                 <p className="text-gray-500">
//                   Work together with your team in real-time
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-4">
//               <div className="bg-white shadow-lg p-4 rounded-full">
//                 <FaShieldAlt className="text-blue-500 text-xl" />
//               </div>

//               <div>
//                 <h3 className="font-semibold text-lg">
//                   Secure & Private
//                 </h3>

//                 <p className="text-gray-500">
//                   JWT authentication & role-based access
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-4">
//               <div className="bg-white shadow-lg p-4 rounded-full">
//                 <FaCloud className="text-blue-500 text-xl" />
//               </div>

//               <div>
//                 <h3 className="font-semibold text-lg">
//                   Cloud Based
//                 </h3>

//                 <p className="text-gray-500">
//                   Access your documents from anywhere
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-4">
//               <div className="bg-white shadow-lg p-4 rounded-full">
//                 <FaHistory className="text-blue-500 text-xl" />
//               </div>

//               <div>
//                 <h3 className="font-semibold text-lg">
//                   Version History
//                 </h3>

//                 <p className="text-gray-500">
//                   Track changes and restore previous versions
//                 </p>
//               </div>
//             </div>

//           </div>
//         </div>

//         {/* RIGHT SIDE */}

//         <div className="w-full lg:w-1/2 flex justify-center items-center bg-gray-50 p-8">

//           <div className="bg-white w-full max-w-[540px] rounded-[30px] shadow-xl p-10">

//             <h1 className="text-6xl font-bold text-center text-slate-900">
//               Welcome Back!
//             </h1>

//             <p className="text-center text-gray-500 mt-4 mb-10 text-lg">
//               Login to continue to your account
//             </p>

//             <form className="space-y-6">

//               {/* Email */}

//               <div>
//                 <label className="font-semibold">
//                   Email Address
//                 </label>

//                 <div className="mt-2 relative">
//                   <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />

//                   <input
//                     type="email"
//                     placeholder="Enter your email"
//                     className="w-full border border-gray-300 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>

//               {/* Password */}

//               <div>
//                 <label className="font-semibold">
//                   Password
//                 </label>

//                 <div className="mt-2 relative">
//                   <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />

//                   <input
//                     type="password"
//                     placeholder="Enter your password"
//                     className="w-full border border-gray-300 rounded-xl py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />

//                   <FiEye className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl cursor-pointer" />
//                 </div>
//               </div>

//               {/* Remember */}

//               <div className="flex justify-between items-center">

//                 <label className="flex items-center gap-2">
//                   <input type="checkbox" />
//                   Remember me
//                 </label>

//                 <a
//                   href="#"
//                   className="text-blue-600 font-medium"
//                 >
//                   Forgot Password?
//                 </a>

//               </div>

//               {/* Sign In */}

//               <button
//                 type="submit"
//                 className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 text-white text-xl font-semibold hover:scale-[1.01] transition"
//               >
//                 Sign In
//               </button>

//               {/* Divider */}

//               <div className="flex items-center gap-4">

//                 <div className="h-[1px] flex-1 bg-gray-300"></div>

//                 <span className="text-gray-400 text-sm">
//                   OR CONTINUE WITH
//                 </span>

//                 <div className="h-[1px] flex-1 bg-gray-300"></div>

//               </div>

//               {/* Google */}

//               <button
//                 type="button"
//                 className="w-full border border-gray-300 rounded-xl py-4 flex justify-center items-center gap-3 hover:bg-gray-50"
//               >
//                 <FcGoogle size={28} />
//                 <span className="font-medium">
//                   Continue with Google
//                 </span>
//               </button>

//               <p className="text-center text-gray-500 pt-4">
//                 Don't have an account?

//                 <a
//                   href="#"
//                   className="text-blue-600 font-semibold ml-1"
//                 >
//                   Create Account
//                 </a>
//               </p>

//             </form>

//           </div>

//         </div>

//       </div>
//     </div>
//   );
// }
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
import { FiLock, FiEye } from "react-icons/fi";

import bgImage from "../assets/collab-bg.png";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-100 to-blue-300 p-4">
      <div className="bg-white rounded-[30px] shadow-2xl overflow-hidden h-[95vh] flex">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-blue-100 p-10 flex-col">

          {/* Logo */}
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

          {/* Heading */}
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

          {/* Illustration */}
          <div className="flex justify-center mt-6">
            <img
              src={bgImage}
              alt="collaboration"
              className="max-w-[500px] w-full"
            />
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mt-4">

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
        <div className="w-full lg:w-1/2 bg-gray-50 flex items-center justify-center px-6">

          <div className="bg-white w-full max-w-[520px] rounded-[30px] shadow-xl p-10">

            <h1 className="text-5xl font-bold text-center text-slate-900">
              Welcome Back!
            </h1>

            <p className="text-center text-gray-500 mt-3 mb-8">
              Login to continue to your account
            </p>

            <form className="space-y-5">

              {/* Email */}
              <div>
                <label className="font-medium">
                  Email Address
                </label>

                <div className="relative mt-2">
                  <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />

                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full border border-gray-300 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="font-medium">
                  Password
                </label>

                <div className="relative mt-2">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />

                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full border border-gray-300 rounded-xl py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <FiEye className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" />
                </div>
              </div>

              {/* Remember */}
              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  Remember me
                </label>

                <button
                  type="button"
                  className="text-blue-600"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Sign In */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 text-white font-semibold text-lg"
              >
                Sign In
              </button>
              <Link
  to="/forgot-password"
  className="text-blue-600"
>
  Forgot Password?
</Link>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="h-[1px] bg-gray-300 flex-1"></div>

                <span className="text-gray-400 text-sm">
                  OR CONTINUE WITH
                </span>

                <div className="h-[1px] bg-gray-300 flex-1"></div>
              </div>

              {/* Google */}
              <button
                type="button"
                className="w-full border border-gray-300 rounded-xl py-4 flex justify-center items-center gap-3 hover:bg-gray-50"
              >
                <FcGoogle size={25} />
                Continue with Google
              </button>

              {/* Register */}
              
              <p className="text-center text-gray-500">
  Don't have an account?

  <Link
    to="/register"
    className="text-blue-600 font-semibold ml-1"
  >
    Create Account
  </Link>
</p>

            </form>

          </div>
        </div>
      </div>
    </div>
  );
}