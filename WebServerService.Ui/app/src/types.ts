// src/types.ts
export interface FilterCriterion {
  Column: string;
  Value: string;
}

export interface QueryParams {
  PageIndex: number;
  PageSize: number;
  SortedField?: string;
  SortedType?: 0 | 1;
  Filters?: FilterCriterion[];
}
export interface Event {
  id: string;
  data: string;
  timestamp: string;
  isProcessed: boolean;
}