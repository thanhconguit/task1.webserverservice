// services/userService.ts
import axiosClient from './axiosClient';
import { getAccessToken } from './authService';
import { CreatOrUpdateUser, FilterCriterion, QueryParams, User } from '../types';
import { createQueryString } from '../utilities';

const API_BASE_URL = 'https://localhost:44339/api';
const headers = {
  Authorization: `Bearer ${getAccessToken()}`,
};
export const getUsers = async (
  pageIndex: number,
  pageSize: number,
  sortedField?: string,
  sortedType?: number,
  filters?: FilterCriterion[]
) => {
  try {
    const query: QueryParams = {
      PageIndex: pageIndex,
      PageSize: pageSize,
      SortedField: sortedField,
      SortedType: sortedType, // 1 for ascending, 2 for descending
      Filters: filters
  };
  const queryString = createQueryString(query);

    const response = await axiosClient.get(`${API_BASE_URL}/user?${queryString}`, {headers});
    return response.data; 
  } catch (error) {
    throw new Error('Failed to fetch users ánnsnsn');
  }
};
export const addUser = async (userData: CreatOrUpdateUser) => {
  try {
    const response = await axiosClient.post(`${API_BASE_URL}/user/add`, userData);
    return response.data; // Assuming API returns newly added user data
  } catch (error) {
    throw new Error('Failed to add user.'); // Handle error as needed
  }
};

export const editUser = async (updatedUserData: any) => {
  try {
    const response = await axiosClient.put(`${API_BASE_URL}/user/edit`, updatedUserData);
    return response.data; // Assuming API returns updated user data
  } catch (error) {
    throw new Error('Failed to edit user.'); // Handle error as needed
  }
};

export const deleteUser = async (userId: string) => {
  try {
    await axiosClient.delete(`${API_BASE_URL}/user/delete/${userId}`);
    // No return value assuming success
  } catch (error) {
    throw new Error('Failed to delete user.'); // Handle error as needed
  }
};
