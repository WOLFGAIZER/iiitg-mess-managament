import React from "react";
import { useNavigate } from "react-router-dom";
import { UserIcon, TicketIcon, ClipboardDocumentListIcon, EnvelopeIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const Dashboard = () => {
  const navigate = useNavigate();

  const buttons = [
    { title: "View Profile", icon: UserIcon, path: "/view-profile", color: "bg-blue-500", hoverColor: "hover:bg-blue-600" },
    { title: "Tokens", icon: TicketIcon, path: "/tokens", color: "bg-green-500", hoverColor: "hover:bg-green-600" },
    { title: "Food & Menu", icon: ClipboardDocumentListIcon, path: "/food-menu", color: "bg-yellow-500", hoverColor: "hover:bg-yellow-600" },
    { title: "Feedback & Complaint", icon: EnvelopeIcon, path: "/feedback-complaint", color: "bg-orange-500", hoverColor: "hover:bg-orange-600" },
    { title: "Voting", icon: CheckCircleIcon, path: "/voting", color: "bg-purple-500", hoverColor: "hover:bg-purple-600" },
  ];
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome, MyMessUser!</h1>

      {/* Notifications */}
      <div className="bg-red-300 p-4 rounded-lg flex justify-between items-center mb-6 shadow-lg">
        <span className="font-bold text-red-900">NOTIFICATIONS</span>
        <span className="text-gray-700">Welcome user to the new automated mess....!</span>
        <button className="bg-red-500 hover:bg-red-700 transition text-white p-2 rounded-full shadow-md">
          🔔
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6">
        {buttons.map((button, index) => {
          const IconComponent = button.icon;
          return (
            <button
              key={index}
              onClick={() => navigate(button.path)}
              className={`${button.color} ${button.hoverColor} text-white p-6 rounded-lg flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105`}
            >
              <IconComponent className="h-8 w-8" />
              <span className="text-xl font-semibold">{button.title}</span>
            </button>
          );
        })}
  
        </div>
    </div>
  );
};

export default Dashboard;
