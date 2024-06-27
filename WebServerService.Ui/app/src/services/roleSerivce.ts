// services/roleService.ts
import axiosClient from './axiosClient';

import { API_BASE_URL, TOKEN_KEY } from '../constant';

export const addRole = async (roleData: any) => {
  try {
    const response = await axiosClient.post(`${API_BASE_URL}/role`, roleData);
    return response.data; 
  } catch (error) {
    throw new Error('Failed to add role.'); 
  }
};

export const editRole = async (roleId: string, updatedRoleData: any) => {
  try {
    const response = await axiosClient.put(`${API_BASE_URL}/role/${roleId}`, updatedRoleData);
    return response.data; 
  } catch (error) {
    throw new Error('Failed to edit role.'); 
  }
};

export const deleteRole = async (roleId: string) => {
  try {
    await axiosClient.delete(`${API_BASE_URL}/role/${roleId}`);
   
  } catch (error) {
    throw new Error('Failed to delete role.'); 
  }
};

export const getAllRoles = async () => {
  try {
   const response = await axiosClient.get(`${API_BASE_URL}/role/all`);
    return response.data; 
  } catch (error) {
    throw new Error('Failed to get roles.');
};
}
