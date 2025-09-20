export interface Column {
  field?: string;
  label: string;
  type?: 'text' | 'status' | 'actions' | 'date' | 'datetime' | 'currency';
  width?: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  formatter?: (value: any) => string;
}

export interface GridProps {
  items: any[];
  columns: Column[];
  loading?: boolean;
  loadingText?: string;
  pageSize?: number;
  currentPage?: number;
  totalItems?: number;
  sortBy?: string;
  sortDesc?: boolean;
}

export interface GridEvents {
  (e: 'edit', item: any): void;
  (e: 'delete', item: any): void;
  (e: 'page-change', page: number): void;
  (e: 'sort', { field, desc }: { field: string; desc: boolean }): void;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hasPrevious: boolean;
  hasNext: boolean;
}