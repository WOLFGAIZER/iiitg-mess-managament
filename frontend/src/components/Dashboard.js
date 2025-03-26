import React from "react";
import Card from "./Card";

const Dashboard = () => {
  const cards = [
    { title: "View Profile", color: "#f59e0b", icon: "👤" },
    { title: "Scan QR Code", color: "#f59e0b", icon: "📱" },
    { title: "Live Bill Tracking", color: "#f59e0b", icon: "💰" },
    { title: "Online Mess Cut", color: "#f59e0b", icon: "✂️" },
    { title: "Pay Mess Bill", color: "#f59e0b", icon: "💳" },
    { title: "Feedback & Complaint", color: "#f59e0b", icon: "📩" },
    { title: "Votings Page", color: "#f59e0b", icon: "✅" },
  ];

  return (
    <div>
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
      {cards.map((card, index) => (
        <Card key={index} {...card} />
      ))}
    </div>
    </div>
    
  );
};

export default Dashboard;
