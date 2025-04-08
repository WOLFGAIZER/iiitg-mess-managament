import React from "react";

const UserInteractionPage = () => {
  return (
    <div className="p-5 text-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome, MyMessUser!</h1>

      {/* Notifications */}
      <div className="bg-red-300 p-4 rounded-lg flex justify-between items-center mb-6 shadow-lg">
        <span className="font-bold text-red-900">NOTIFICATIONS</span>
        <span className="text-gray-700">Welcome user to the new automated mess....!</span>
        <button className="bg-red-500 hover:bg-red-700 transition text-white p-2 rounded-full shadow-md">
          🔔
        </button>
      </div>

       {/* 📌 Action Buttons */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Button text="View Profile" icon="👤" color="bg-blue-500" />
        <Button text="Tokens" icon="🎟️" color="bg-green-500" />
        <Button text="Food & Menu" icon="📋" color="bg-yellow-500" />
        <Button text="Feedback & Complaint" icon="✉️" color="bg-orange-500" />
        <Button text="Voting" icon="✅" color="bg-purple-500" />
      </div>
    </div>
  );
};
      {/* Mess Actions */}
<div className="mt-8 p-5 bg-red-400 rounded-lg text-white shadow-lg">
  <h2 className="text-lg font-bold">Mess Actions</h2>
  <div className="flex justify-center mt-4 gap-6">
    <button className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-lg shadow-md transition">
      CLOSE MESS
    </button>
    <button className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-lg shadow-md transition">
      VIEW MENU
    </button>
  </div>
</div> 



// Button Component with Dynamic Color
const Button = ({ text, icon, color }) => {
  return (
    <button className={`${color} text-white p-4 rounded-lg flex flex-col items-center shadow-md hover:scale-105 transition-transform`}>
      <span className="text-4xl">{icon}</span>
      <span className="mt-2 font-bold text-lg">{text}</span>
    </button>
  );
};

// Exporting the component
export default UserInteractionPage;
