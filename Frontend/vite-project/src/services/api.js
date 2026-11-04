// Frontend/vite-project/src/services/api.js
import axios from 'axios';

/**
 * Intelligent Base URL resolver:
 * 1. Automatically checks import.meta.env.VITE_API_URL.
 * 2. If VITE_API_URL is missing, dummy ('YOUR_...', 'http://localhost:5100/api' in remote preview, etc.),
 *    it gracefully falls back to relative '/api' or the local backend endpoint.
 * 3. When a real deployment URL (e.g. https://your-backend.onrender.com/api) is placed in .env,
 *    it automatically connects directly to the live backend without any code modifications!
 */
export const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;

  if (typeof window !== 'undefined') {
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    // In remote browser or cloud environments (Cloud Run, preview, Vercel preview):
    // Fall back to relative '/api' if envUrl is dummy, missing, or localhost
    if (!isLocalhost) {
      if (
        !envUrl ||
        envUrl.trim() === '' ||
        envUrl.includes('localhost') ||
        envUrl.includes('127.0.0.1') ||
        envUrl.includes('YOUR_') ||
        envUrl.includes('example.com')
      ) {
        return '/api';
      }
      return envUrl;
    }

    // On local developer machine:
    if (
      envUrl &&
      envUrl.trim() !== '' &&
      !envUrl.includes('YOUR_') &&
      !envUrl.includes('example.com')
    ) {
      return envUrl;
    }

    // If running under unified server on port 3000
    if (window.location.port === '3000') {
      return '/api';
    }

    // Standard local fallback (Vite dev server + Express on 5100)
    return 'http://localhost:5100/api';
  }

  return envUrl || '/api';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT Bearer token to headers if present in localStorage
api.interceptors.request.use(
  (config) => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const { token } = JSON.parse(userInfo);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (err) {
      console.error('Failed to parse userInfo from localStorage:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Extract clean error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.statusText ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
