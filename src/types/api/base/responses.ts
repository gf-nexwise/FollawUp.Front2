export interface PagedResponse<T> {
  items: T[];
  totalItems: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface ApiError {
  message: string;
  errors?: string[];
  statusCode?: number;
}