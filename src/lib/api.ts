import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor injecting token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor capturing 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const errorMsg = error.response.data?.error || 'Unauthorized';
      
      const { clearAuth, setAuthError } = useAuthStore.getState();
      clearAuth();
      
      // Determine user-friendly/localized error reason
      if (typeof errorMsg === 'string' && errorMsg.includes('client IP changed')) {
        setAuthError('IP_MISMATCH');
      } else if (typeof errorMsg === 'string' && (errorMsg.includes('expired') || errorMsg.includes('invalid'))) {
        setAuthError('SESSION_EXPIRED');
      } else {
        setAuthError('UNAUTHORIZED');
      }
    }
    return Promise.reject(error);
  }
);
