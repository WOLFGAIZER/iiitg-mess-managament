import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import UserDetailsPage from "./components/UserDetailsPage";
import OTPVerificationPage from "./components/OTPVerificationPage";
import Page from "./components/Page";
import Registration from "./components/Registrationpage";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import PhoneAuth from './components/PhoneAuth';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Registration />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/user-details" element={<UserDetailsPage />} />
          <Route path="/verify-otp" element={<OTPVerificationPage />} />
          <Route path="/verify-login-otp" element={<OTPVerificationPage />} />
          <Route path="/page/:name" element={<Page />} />
          <Route path="/phone-auth" element={<PhoneAuth />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

