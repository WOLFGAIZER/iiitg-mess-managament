import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BellIcon, Cog6ToothIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsOpen(false);
  };


  return (
    <nav className="bg-red-500 px-6 py-4 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center">
          <h1 className="ml-2 text-2xl font-bold text-white">MyMess</h1>
        </div>
        <div className="hidden space-x-6 md:flex">
        <button
            onClick={() => navigate("/view-profile")}
            className="text-white bg-transparent border-none hover:bg-red-600 rounded-md shadow-md px-3 py-1 transition-all duration-200"
          >
            View Profile
          </button>
          <button
            onClick={() => navigate("/tokens")}
            className="text-white bg-transparent border-none hover:bg-red-600 rounded-md shadow-md px-3 py-1 transition-all duration-200"
          >
            Tokens
          </button>
          <button
            onClick={() => navigate("/food-menu")}
            className="text-white bg-transparent border-none hover:bg-red-600 rounded-md shadow-md px-3 py-1 transition-all duration-200"
          >
            Food & Menu
          </button>
          <button
            onClick={() => navigate("/feedback-complaint")}
            className="text-white bg-transparent border-none hover:bg-red-600 rounded-md shadow-md px-3 py-1 transition-all duration-200"
          >
            Feedback & Complaint
          </button>
          <button
            onClick={() => navigate("/voting")}
            className="text-white bg-transparent border-none hover:bg-red-600 rounded-md shadow-md px-3 py-1 transition-all duration-200"
          >
            Voting
          </button>
          <button
            onClick={handleLogout}
            className="text-white bg-transparent border-none hover:bg-red-600 rounded-md shadow-md px-3 py-1 transition-all duration-200"
          >
            Logout 
          </button>  
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <BellIcon className="h-6 w-6 text-white cursor-pointer hover:text-gray-200" />
          <Cog6ToothIcon className="h-6 w-6 text-white cursor-pointer hover:text-gray-200" />
        </div>
        <button className="md:hidden text-white focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden mt-4 space-y-2 bg-red-600 p-4">
          <Link to="/view-profile" className="block text-white hover:underline">View Profile</Link>
          <Link to="/tokens" className="block text-white hover:underline">Tokens</Link>
          <Link to="/food-menu" className="block text-white hover:underline">Food & Menu</Link>
          <Link to="/feedback-complaint" className="block text-white hover:underline">Feedback & Complaint</Link>
          <Link to="/voting" className="block text-white hover:underline">Voting</Link>
          <button onClick={handleLogout} className="block text-white hover:underline">Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;