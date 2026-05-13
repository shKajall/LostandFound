import { Link } from "react-router-dom";
import React from "react";

export default function AuthLayout({ title, subtitle, children, bgColor }) {
  return (
    <div className="flex min-h-screen">
      {/* Left Side */}
      <div className={`w-full  md:w-1/2 ${bgColor} flex items-center justify-center`}>
        <h1 className="text-4xl font-bold text-white text-center px-4">
          {subtitle}
        </h1>
      </div>

      {/* Right Side */}
      <div className="w-full  md:w-1/2 flex flex-col bg-gray-100">
        {/* Navbar */}
        <nav className="flex justify-end space-x-4 p-4">
          <Link
            to="/signup"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 no-underline"
          >
            Signup
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 no-underline"
          >
            Login
          </Link>
        </nav>

        {/* Form Section */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              {title}
            </h2>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}