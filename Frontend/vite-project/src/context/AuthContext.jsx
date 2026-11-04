// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on initial render
  useEffect(() => {
    try {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        const parsed = JSON.parse(storedUserInfo);
        setUser({
          _id: parsed._id,
          name: parsed.name,
          email: parsed.email,
          role: parsed.role,
        });
        setToken(parsed.token);
      }
    } catch (err) {
      console.error('Failed to restore auth session from localStorage:', err);
      localStorage.removeItem('userInfo');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Log in user
   */
  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    });
    setToken(data.token);
    return data;
  };

  /**
   * Register customer
   */
  const register = async (name, email, password) => {
    const data = await authService.register({ name, email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    });
    setToken(data.token);
    return data;
  };

  /**
   * Log out user and clean localStorage
   */
  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
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

export default AuthContext;
