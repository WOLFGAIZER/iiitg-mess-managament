import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SignIn from './pages/SignIn';
import ComplaintPage from './pages/ComplaintPage';
import Registration from './components/Registrationpage';
import OTPVerificationPage from './pages/OTPVerificationPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccess from './pages/PaymentSuccess';
import MainLayout from './components/Layout/MainLayout';
import Profile from './pages/Profile';
import Tokens from './pages/Tokens';
import FoodMenu from './pages/FoodMenu';
import Feedback from './pages/Feedback';
import Voting from './pages/Voting';
import Login from './pages/Login';
import Register from './pages/Register';
import ViewProfile from './pages/ViewProfile';
import FeedbackComplaint from './pages/FeedbackComplaint';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          {/* Global Navigation */}
          <Navbar />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/verify-login-otp" element={<OTPVerificationPage />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route path="profile" element={<ViewProfile />} />
              <Route path="tokens" element={<Tokens />} />
              <Route path="food-menu" element={<FoodMenu />} />
              <Route path="feedback" element={<FeedbackComplaint />} />
              <Route path="voting" element={<Voting />} />
              <Route index element={<ViewProfile />} />
            </Route>
            
            <Route path="/complaints" element={
              <ProtectedRoute>
                <ComplaintPage />
              </ProtectedRoute>
            } />

            <Route path="/payment" element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            } />
            
            <Route path="/payment-success" element={
              <ProtectedRoute>
                <PaymentSuccess />
              </ProtectedRoute>
            } />

            {/* Redirect root to dashboard if authenticated, otherwise to signin */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 Route */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900">Page Not Found</h2>
                  <p className="mt-2 text-gray-600">The page you're looking for doesn't exist.</p>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App; 