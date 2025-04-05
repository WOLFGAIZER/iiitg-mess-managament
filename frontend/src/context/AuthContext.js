import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";

const AuthContext = createContext(null);

// Axios instance with base URL and token interceptor
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set up axios interceptor to include token in headers
  useEffect(() => {
    api.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }, [token]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        console.log("Checking auth, stored token:", storedToken); // Debug
        if (storedToken) {
          setToken(storedToken);
          try {
            const res = await api.get("/users/profile");
            console.log("Profile response:", res.data); // Debug
            setUser(res.data);
          } catch (profileErr) {
            console.error("Profile fetch failed:", profileErr.message); // Debug
            // Don’t clear token on profile failure; keep it for manual verification
            setError("Couldn’t fetch profile, but token retained.");
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err.message); // Debug
        setError("Failed to restore session. Please log in again.");
        setToken(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      const res = await api.post("/users/login", credentials);
      const { token, user } = res.data;
      console.log("Login success, token:", token, "user:", user);
      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);
      setError(null);
    } catch (err) {
      console.error("Login failed:", err.response?.data?.message || err.message)
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    try {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      setError(null);
    } catch (err) {
      setError("Failed to logout");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        logout,
        api, // Provide axios instance for components
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;