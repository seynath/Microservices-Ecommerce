// src/api/api.js
import axios from 'axios';
import { store } from '@/app/store';
import { refreshAccessToken, logout } from '@/features/userSlice';

// Axios instance
const api = axios.create({
  baseURL: 'http://localhost:6001/user', // Base URL for User Service
  withCredentials: true, // Ensures cookies (refresh token) are sent with the request
});

// Request interceptor to attach access token to all requests
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const accessToken = state.user.accessToken; // Get access token from Redux
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`; // Add token to Authorization header
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 (Unauthorized) and refresh the token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshResponse = await store.dispatch(refreshAccessToken()); // Dispatch refresh token action
      if (refreshResponse.meta.requestStatus === 'fulfilled') {
        const newAccessToken = refreshResponse.payload.accessToken;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`; // Update the token
        return axios(originalRequest); // Retry the request with the new token
      } else {
        store.dispatch(logout()); // Logout if refresh token fails
      }
    }
    return Promise.reject(error);
  }
);

export default api;
