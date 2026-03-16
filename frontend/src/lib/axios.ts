import axios from 'axios';

/** Backend API base; must end with /api so paths like /admin/settings/fx-rate resolve correctly. */
function getApiBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const base = env.trim().replace(/\/+$/, '');
  return base.endsWith('/api') ? base : `${base}/api`;
}

const axiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect if this was the login request (avoid clearing form state)
    const isLoginRequest = error.config?.url?.includes('/admin/auth/login');
    if (
      error.response?.status === 401 &&
      typeof window !== 'undefined' &&
      !isLoginRequest
    ) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
