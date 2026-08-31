import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor — attach Bearer token
apiClient.interceptors.request.use(
  (config) => {
    // Token key standar: 'TOKEN' (uppercase)
    const token = localStorage.getItem('TOKEN');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 Unauthorized (token expired / session invalid)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Hapus semua data auth dan paksa redirect ke login
      localStorage.removeItem('TOKEN');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_email');
      localStorage.removeItem('session_id');
      sessionStorage.removeItem('active_session');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
