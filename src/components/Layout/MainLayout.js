import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MainLayout = () => {
  const { user } = useAuth();

  const navLinks = [
    {
      path: '/profile',
      name: 'View Profile',
      icon: 'UserIcon'
    },
    {
      path: '/tokens',
      name: 'Tokens',
      icon: 'TicketIcon'
    },
    {
      path: '/food-menu',
      name: 'Food & Menu',
      icon: 'MenuIcon'
    },
    {
      path: '/feedback',
      name: 'Feedback & Complaint',
      icon: 'ChatIcon'
    },
    {
      path: '/voting',
      name: 'Voting',
      icon: 'VoteIcon'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium
                    ${isActive
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-700">
                Welcome, {user?.name}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout; 