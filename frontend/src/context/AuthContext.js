import React, { createContext, useContext, useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
          setUser(JSON.parse(loggedInUser));
        }
      } catch (err) {
        setError('Failed to restore session');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (userData) => {
    try {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      setError('Failed to login');
      throw err;
    }
  };

  const logout = () => {
    try {
      setUser(null);
      localStorage.removeItem('user');
    } catch (err) {
      setError('Failed to logout');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      loading, 
      error,
      login,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 