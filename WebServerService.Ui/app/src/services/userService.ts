// services/userService.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const addUser = async (userData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, userData);
    return response.data; // Assuming API returns newly added user data
  } catch (error) {
    throw new Error('Failed to add user.'); // Handle error as needed
  }
};

export const editUser = async (userId: string, updatedUserData: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/${userId}`, updatedUserData);
    return response.data; // Assuming API returns updated user data
  } catch (error) {
    throw new Error('Failed to edit user.'); // Handle error as needed
  }
};

export const deleteUser = async (userId: string) => {
  try {
    await axios.delete(`${API_BASE_URL}/users/${userId}`);
    // No return value assuming success
  } catch (error) {
    throw new Error('Failed to delete user.'); // Handle error as needed
  }
};
