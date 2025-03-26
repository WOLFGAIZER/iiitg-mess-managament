import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleOTPSubmit = (e) => {
    e.preventDefault();
    if (otp === "123456") { // Dummy OTP check (Replace with real verification)
      alert("OTP Verified! Proceeding to dashboard...");
      navigate("/dashboard"); // Redirect to dashboard after verification
    } else {
      alert("Invalid OTP. Try again!");
    }
  };

  return (
    <div className="otp-container">
      <h2>Verify Your Identity</h2>
      <form onSubmit={handleOTPSubmit}>
        <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" required />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
};

export default OTPVerificationPage;
