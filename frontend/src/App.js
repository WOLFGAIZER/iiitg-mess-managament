import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserInteractionPage from "./components/UserInteractionPage";
import UserDetailsPage from "./components/UserDetailsPage";
import OTPVerificationPage from "./components/OTPVerificationPage";
import Dashboard from "./components/Dashboard";
import Page from "./components/Page";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/user-details" element={<UserDetailsPage />} />
        <Route path="/otp-verification" element={<OTPVerificationPage />} />
        <Route path="/page/:name" element={<Page />} />
      </Routes>
    </>
  );
}

export default App;
