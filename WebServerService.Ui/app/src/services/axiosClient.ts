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
  async (response) => {
    
    return response;
  },
  async (error) => {
    console.error('axios interceptors response', error.response?.data ?? error);
    return Promise.reject(error.response?.data ?? error);
  }
);

export default axiosClient;
 