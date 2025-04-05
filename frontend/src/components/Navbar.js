import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
        <div className="hidden md:flex items-center space-x-4">
          <BellIcon className="h-6 w-6 text-white cursor-pointer hover:text-gray-200" />
          <Cog6ToothIcon className="h-6 w-6 text-white cursor-pointer hover:text-gray-200" />
          <button
            onClick={handleLogout}
            className="text-white bg-transparent border-none hover:bg-red-600 rounded-md shadow-md px-3 py-1 transition-all duration-200"
          >
            Logout
          </button>
        </div>
        <button className="md:hidden text-white focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden mt-4 space-y-2 bg-red-600 p-4">
          <button onClick={handleLogout} className="block text-white hover:underline">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
 };

export default Navbar;