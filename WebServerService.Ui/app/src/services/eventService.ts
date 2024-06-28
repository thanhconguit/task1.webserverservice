// services/eventService.ts
import axiosClient from './axiosClient';
import { getAccessToken } from './authService';
import { FilterCriterion, QueryParams } from '../types'; 
import { createQueryString } from '../utilities'; 

const API_BASE_URL = 'https://localhost:44339/api';
const headers = {
  Authorization: `Bearer ${getAccessToken()}`,
};
export const getEvents = async (
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

    const response = await axiosClient.get(`${API_BASE_URL}/event?${queryString}`, {headers});
    console.log(456);
    return response.data; 
  } catch (error) {
    throw new Error('Failed to fetch events');
  }
};

export const markEventProcessed = async (eventId: string) => {
  try {
    const response = await axiosClient.put(`${API_BASE_URL}/event/${eventId}/processed`, {}, { headers });
    return response.data; 
  } catch (error) {
    throw new Error('Failed to mark event as processed.'); 
  }
};
