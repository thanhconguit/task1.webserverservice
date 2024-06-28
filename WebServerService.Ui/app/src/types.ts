// src/types.ts
export interface FilterCriterion {
  Column: string;
  Value: string;
}

export interface QueryParams {
  PageIndex: number;
  PageSize: number;
  SortedField?: string;
  SortedType?: number;
  Filters?: FilterCriterion[];
}
export interface Event {
  id: string;
  data: string;
  timestamp: string;
  isProcessed: boolean;
}

export interface AssignedRole {
  roleId: string; 
  roleName: string; 
}

export interface User {
  id: string; 
  userName: string;
  surName: string;
  email: string;
  phoneNumber: string;
  assignedRole: AssignedRole; 
}

export interface CreatOrUpdateUser {
  id?: string
  userName: string;
  surName: string;
  email: string;
  phoneNumber: string;
  assignedRole: AssignedRole; 
  password?: string;
}

export interface Role {
  id? : string;
  name: string;
}

export interface Notification {
  data: string;
  timestamp: string;
  isProcessed: boolean;
  id: string;
}

