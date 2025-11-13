import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: handle errors and refresh token if needed
api.interceptors.response.use(
  response => response,
  error => {
    const axiosError = error as AxiosError;
    // Handle 401 (Unauthorized) - redirect to login
    if (axiosError.response?.status === 401) {
      console.warn('Unauthorized - redirect to login');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
