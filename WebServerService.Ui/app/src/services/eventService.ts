// services/eventService.ts
import axios from 'axios';
import { getAccessToken } from './authService';
import { FilterCriterion } from '../types'; 

const API_BASE_URL = 'https://localhost:44339/api';
const headers = {
  Authorization: `Bearer ${getAccessToken()}`,
};
export const getEvents = async (
  pageIndex: number,
  pageSize: number,
  sortedField?: string,
  sortedType?: 0 | 1,
  filters?: FilterCriterion[]
) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/event`, {
      params: {
        pageIndex,
        pageSize,
        sortedField,
        sortedType,
        filters,
      }, headers
    }, );
    return response.data; // Assuming response.data contains events data
  } catch (error) {
    throw new Error('Failed to fetch events');
  }
};

export const markEventProcessed = async (eventId: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/event/${eventId}/process`, { headers });
    return response.data; // Assuming API confirms event marked as processed
  } catch (error) {
    throw new Error('Failed to mark event as processed.'); 
  }
};
