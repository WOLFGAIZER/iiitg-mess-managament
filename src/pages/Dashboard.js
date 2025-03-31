import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Import Tab Components
import ViewProfile from './ViewProfile';
import Tokens from './Tokens';
import FoodMenu from './FoodMenu';
import FeedbackComplaint from './FeedbackComplaint';
import Voting from './Voting';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('viewProfile');

  // Define tabs with their properties
  const tabs = [
    {
      id: 'viewProfile',
      label: 'View Profile',
      icon: 'UserIcon',
      component: <ViewProfile />
    },
    {
      id: 'tokens',
      label: 'Tokens',
      icon: 'TicketIcon',
      component: <Tokens />
    },
    {
      id: 'foodMenu',
      label: 'Food & Menu',
      icon: 'MenuIcon',
      component: <FoodMenu />
    },
    {
      id: 'feedbackComplaint',
      label: 'Feedback & Complaint',
      icon: 'ChatIcon',
      component: <FeedbackComplaint />
    },
    {
      id: 'voting',
      label: 'Voting',
      icon: 'VoteIcon',
      component: <Voting />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium
                    ${activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* User Info */}
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-4">
                Welcome, {user?.name}
              </span>
              <button
                onClick={() => navigate('/logout')}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Display Active Tab Content */}
          <div className="bg-white rounded-lg shadow p-6">
            {tabs.find(tab => tab.id === activeTab)?.component}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 