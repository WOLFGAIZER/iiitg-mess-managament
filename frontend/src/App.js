import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Registration from "./components/Registrationpage";
import Login from "./components/Login";
import ViewProfile from "./components/ViewProfile";
import Tokens from "./components/Tokens";
import FoodMenu from "./components/FoodMenu"; // Rename from Food&Menu
import FeedbackComplaint from "./components/FeedbackComplaint";
import Voting from "./components/Voting";
import UserDetailsPage from "./components/UserDetailsPage"; // Add this import
import OTPVerification from "./components/OTPVerification";
import OTPVerificationPage from "./components/OTPVerificationPage"; // Add this import for the 4-digit OTP page
import SignUp from "./components/SignUp"; // Add this import
import SignIn from "./components/SignIn"; // Add this import
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthProvider from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<SignIn />} /> {/* Add this for SignIn navigation */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/user-details" element={<UserDetailsPage />} /> {/* Add this route */}
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/verify-otp" element={<OTPVerificationPage />} /> {/* Add this for 4-digit OTP */}
        <Route path="/verify-login-otp" element={<OTPVerificationPage />} />
        <Route
          path="/dashboard"
          element={<Dashboard />} // Add this route
        />
        <Route
          path="/view-profile"
          element={<ProtectedRoute><ViewProfile /></ProtectedRoute>}
        />
        <Route
          path="/tokens"
          element={<ProtectedRoute><Tokens /></ProtectedRoute>}
        />
        <Route
          path="/food-menu"
          element={<FoodMenu />}
        />
        <Route
          path="/feedback-complaint"
          element={<ProtectedRoute><FeedbackComplaint /></ProtectedRoute>}
        />
        <Route
          path="/voting"
          element={<ProtectedRoute><Voting /></ProtectedRoute>}
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;