import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sportsSyncToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle specialized errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors (e.g. expired token)
    if (error.response?.status === 401) {
      localStorage.removeItem('sportsSyncToken');
      localStorage.removeItem('sportsSyncUser');
    }
    return Promise.reject(error);
  }
);

export default api;
