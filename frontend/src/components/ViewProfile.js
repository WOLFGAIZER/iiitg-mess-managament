import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const ViewProfile = () => {
  const { user, api, setUser } = useAuth();
  const [formData, setFormData] = useState({ ...user });
  const [message, setMessage] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/users/profile", formData);
      setUser({ ...user, ...formData }); // Update context
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error updating profile");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">View Profile</h1>
      <form onSubmit={handleUpdate} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label>Username</label>
          <input
            type="text"
            value={formData.username || ""}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label>Contact</label>
          <input
            type="text"
            value={formData.contact || ""}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div 
        
        className="mb-4">
          <label>Course

          </label>
          <input
            type="text"
            value={formData.course || ""}
            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-red-500 text-white p-2 rounded">Update</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default ViewProfile;