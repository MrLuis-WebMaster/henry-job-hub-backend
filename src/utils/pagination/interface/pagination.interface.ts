export interface PaginationInfo {
  totalDocuments: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
}
