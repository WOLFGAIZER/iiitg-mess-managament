import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserDetailsPage = () => {
  const [userDetails, setUserDetails] = useState({
    userType: "",
    userID: "",
    department: "",
    dob: "",
    phone: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Store details (in localStorage or state management)
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
    navigate("/verify-otp"); // matching OTP verification
  };

  return (
    <div className="form-container">
      <h2>Enter Your Details</h2>
      <form onSubmit={handleSubmit}>
        <select name="userType" onChange={handleChange} required>
          <option value="">Select User Type</option>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </select>
        <input type="text" name="userID" placeholder="User ID" onChange={handleChange} required />
        <select name="department" onChange={handleChange} required>
          <option value="">Select Department</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
        </select>
        <input type="date" name="dob" onChange={handleChange} required />
        <input type="tel" name="phone" placeholder="Phone No." onChange={handleChange} required />
        <button type="submit">Next</button>
      </form>
    </div>
  );
};

export default UserDetailsPage;