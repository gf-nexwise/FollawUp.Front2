export interface BaseFilter {
  page: number;
  pageSize: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  searchTerm?: string;
}

export interface SortInfo {
  field: string;
  direction: 'asc' | 'desc';
}

export function toSortString(sort: SortInfo): string {
  return sort.direction === 'desc' ? `-${sort.field}` : sort.field;
}

export function fromSortString(sortString: string): SortInfo {
  if (sortString.startsWith('-')) {
    return {
      field: sortString.substring(1),
      direction: 'desc'
    };
  }
  return {
    field: sortString,
    direction: 'asc'
  };
}