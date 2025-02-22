export type QueryInputBlogDto = {
  searchNameTerm?: string;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
  pageNumber?: number;
  pageSize?: number;
};
