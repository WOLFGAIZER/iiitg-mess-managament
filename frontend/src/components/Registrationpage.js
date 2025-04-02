import React from "react";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/path-to-your-background.jpg')" }}
    >
      <div className="flex bg-white bg-opacity-90 rounded-2xl shadow-lg w-3/4 max-w-4xl">
        {/* Left Side */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-800">Welcome to</h1>
          <h2 className="text-4xl font-extrabold text-gray-900">IIITG MESS</h2>
          <p className="mt-4 text-gray-700">
            An application that aims to digitalize and circulate all the services of the mess to the users.
          </p>

          <div className="mt-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">
                I have read and agreed to all the Terms & Conditions
              </span>
            </label>
          </div>

          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600"
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-1/2 bg-red-500 flex flex-col items-center justify-center p-10 rounded-r-2xl">
          <img src="/path-to-your-logo.png" alt="Mess Logo" className="w-20 h-20" />
          <h2 className="text-3xl font-bold text-white">IIITG MESS</h2>
          <p className="text-white mt-2 text-center">WELCOME TO IIIT GUWAHATI MESS!</p>
        </div>
      </div>
    </div>
  );
};

export default Registration;