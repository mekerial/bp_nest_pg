export type QueryInputUserDto = {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
  searchLoginTerm?: string;
  searchEmailTerm?: string;
};
