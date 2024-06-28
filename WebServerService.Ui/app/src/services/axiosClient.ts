import axios from 'axios';
import { API_BASE_URL, TOKEN_KEY } from '../constant';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosClient.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('axios interceptors request', error);
    return Promise.reject(error.response.data);
  }
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirect to login page or handle unauthorized access
      window.location.href = '/login'; // Replace with your login page URL
    }
    return Promise.reject(error);
  }
);
export default axiosClient;
 