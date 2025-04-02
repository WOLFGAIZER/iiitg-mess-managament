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
import ProtectedRoute from "./components/ProtectedRoute";
import AuthProvider from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/login" element={<Login />} />
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
          element={<ProtectedRoute><FoodMenu /></ProtectedRoute>}
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