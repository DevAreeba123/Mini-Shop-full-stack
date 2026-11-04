// src/services/authService.js
import api from './api.js';

/**
 * Register a new customer
 * @param {Object} userData - { name, email, password }
 */
export const register = async (userData) => {
  const response = await api.post('/users/register', userData);
  return response.data;
};

/**
 * Log in an existing user
 * @param {Object} credentials - { email, password }
 */
export const login = async (credentials) => {
  const response = await api.post('/users/login', credentials);
  return response.data;
};

/**
 * Log out user (clears stored session data)
 */
export const logout = () => {
  localStorage.removeItem('userInfo');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
