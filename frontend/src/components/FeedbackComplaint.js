import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const FeedbackComplaint = () => {
  const { api, user } = useAuth();
  const [complaintText, setComplaintText] = useState("");
  const [category, setCategory] = useState("Mess");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/complaints/", {
        complaintText,
        category,
        userID: user.USERID, // Use USERID from user model
      });
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error submitting complaint");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Feedback & Complaint</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label>Complaint Text</label>
          <textarea
            value={complaintText}
            onChange={(e) => setComplaintText(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Academic">Academic</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Hostel">Hostel</option>
            <option value="Mess">Mess</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <button type="submit" className="bg-red-500 text-white p-2 rounded">Submit</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default FeedbackComplaint;