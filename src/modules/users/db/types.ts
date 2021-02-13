export type UserParams = UserSearchParams & {
  username?: string;
};

export type PaginationParams = {
  size?: number;
  page?: number;
};

export type UserSearchParams = {
  activated?: boolean;
};

export type UserQueryParams = UserSearchParams & PaginationParams;
