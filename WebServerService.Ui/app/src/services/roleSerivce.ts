// services/roleService.ts
import axiosClient from './axiosClient';

import { API_BASE_URL, TOKEN_KEY } from '../constant';
import { FilterCriterion, QueryParams } from '../types';
import { createQueryString } from '../utilities';

export const addRole = async (roleData: any) => {
  try {
    const response = await axiosClient.post(`${API_BASE_URL}/role/add`, roleData);
    return response.data; 
  } catch (error) {
    throw new Error('Failed to add role.'); 
  }
};

export const editRole = async (updatedRoleData: any) => {
  try {
    const response = await axiosClient.put(`${API_BASE_URL}/role/edit`, updatedRoleData);
    return response.data; 
  } catch (error) {
    throw new Error('Failed to edit role.'); 
  }
};

export const deleteRole = async (roleId: string) => {
  try {
    await axiosClient.delete(`${API_BASE_URL}/role/delete/${roleId}`);
   
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

export const getRoles = async (
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

    const response = await axiosClient.get(`${API_BASE_URL}/role?${queryString}`);
    return response.data; 
  } catch (error) {
    throw new Error('Failed to fetch users ánnsnsn');
  }
};
