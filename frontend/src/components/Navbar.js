import React, { useState } from "react";
import { BellIcon, Cog6ToothIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-red-500 px-6 py-4 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        
        {/* Left Side - Logo & Name */}
        <div className="flex items-center">
          <h1 className="ml-2 text-2xl font-bold text-white">MyMess</h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden space-x-6 md:flex">
          <a href="#" className="text-white hover:underline">Home</a>
          <a href="#" className="text-white hover:underline">Menu</a>
          <a href="#" className="text-white hover:underline">Bill Tracking</a>
          <a href="#" className="text-white hover:underline">Contact</a>
        </div>

        {/* Right Side - Icons */}
        <div className="hidden md:flex items-center space-x-4">
          <BellIcon className="h-6 w-6 text-white cursor-pointer hover:text-gray-200" />
          <Cog6ToothIcon className="h-6 w-6 text-white cursor-pointer hover:text-gray-200" />
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-2 bg-red-600 p-4">
          <a href="#" className="block text-white hover:underline">Home</a>
          <a href="#" className="block text-white hover:underline">Menu</a>
          <a href="#" className="block text-white hover:underline">Bill Tracking</a>
          <a href="#" className="block text-white hover:underline">Contact</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
