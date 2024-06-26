// services/roleService.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const addRole = async (roleData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/roles`, roleData);
    return response.data; // Assuming API returns newly added role data
  } catch (error) {
    throw new Error('Failed to add role.'); // Handle error as needed
  }
};

export const editRole = async (roleId: string, updatedRoleData: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/roles/${roleId}`, updatedRoleData);
    return response.data; // Assuming API returns updated role data
  } catch (error) {
    throw new Error('Failed to edit role.'); // Handle error as needed
  }
};

export const deleteRole = async (roleId: string) => {
  try {
    await axios.delete(`${API_BASE_URL}/roles/${roleId}`);
    // No return value assuming success
  } catch (error) {
    throw new Error('Failed to delete role.'); // Handle error as needed
  }
};
