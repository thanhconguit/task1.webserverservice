// services/authService.ts
import axios from 'axios';

const API_BASE_URL = 'https://localhost:44339/api';
const TOKEN_KEY = 'accessToken'
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    const token = response.data.accessToken; // Assuming API returns a token
    const refreshToken = response.data.refreshToken;
    localStorage.setItem(TOKEN_KEY, token); // Save token to local storage
    localStorage.setItem('refreshToken', refreshToken); // Save token to local storage

    return response.data; // Assuming API returns user data or token
  } catch (error) {
    throw new Error('Login failed. Please check your credentials.'); // Handle error as needed
  }
};
export const getAccessToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};
export const logout = async () => {
  // Implement logout logic, e.g., clearing tokens or session
};

export const refreshToken = async (refreshToken: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/refresh-token`, { refreshToken });
    return response.data; // Assuming API returns new access token
  } catch (error) {
    throw new Error('Failed to refresh token.'); // Handle error as needed
  }
};
