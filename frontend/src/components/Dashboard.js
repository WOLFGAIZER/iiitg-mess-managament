import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('viewProfile');

  const tabs = [
    { 
      id: 'viewProfile',
      title: "View Profile",
      icon: "👤",
      color: "#f59e0b",
      component: <ViewProfileContent />
    },
    { 
      id: 'tokens',
      title: "Tokens & QR",
      icon: "📱",
      color: "#f59e0b",
      component: <TokensContent />
    },
    { 
      id: 'foodMenu',
      title: "Food & Menu",
      icon: "🍽️",
      color: "#f59e0b",
      component: <FoodMenuContent />
    },
    { 
      id: 'feedbackComplaint',
      title: "Feedback & Complaint",
      icon: "📩",
      color: "#f59e0b",
      component: <FeedbackContent />
    },
    { 
      id: 'voting',
      title: "Votings Page",
      icon: "✅",
      color: "#f59e0b",
      component: <VotingContent />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all
                ${activeTab === tab.id ? 'ring-2 ring-amber-500' : 'hover:shadow-lg'}`}
              style={{ borderTop: `4px solid ${tab.color}` }}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{tab.icon}</span>
                <h3 className="text-lg font-medium text-gray-900">
                  {tab.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Active Tab Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {tabs.find(tab => tab.id === activeTab)?.component}
        </div>
      </main>
    </div>
  );
};

// Tab Content Components
const ViewProfileContent = () => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
    {/* Add profile content */}
  </div>
);

const TokensContent = () => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Tokens & QR</h2>
    {/* Add tokens content */}
  </div>
);

const FoodMenuContent = () => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Food & Menu</h2>
    {/* Add menu content */}
  </div>
);

const FeedbackContent = () => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Feedback & Complaints</h2>
    {/* Add feedback content */}
  </div>
);

const VotingContent = () => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Voting</h2>
    {/* Add voting content */}
  </div>
);

export default Dashboard;
