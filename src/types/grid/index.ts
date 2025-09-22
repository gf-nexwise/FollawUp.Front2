export interface Column {
  field?: string;
  label: string;
  type?: 'text' | 'status' | 'actions' | 'date' | 'datetime' | 'currency';
  width?: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  formatter?: (value: any) => string;
  template?: (item: any) => string;
}

export interface GridProps<T = any> {
  items: T[];
  columns: Column[];
  loading?: boolean;
  loadingText?: string;
  currentPage?: number;
  totalPages?: number;
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

export interface GridEmits<T = any> {
  (e: 'edit', item: T): void;
  (e: 'delete', item: T): void;
  (e: 'page-change', page: number): void;
  (e: 'sort', sort: { field: string; direction: 'asc' | 'desc' }): void;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hasPrevious: boolean;
  hasNext: boolean;
}