import { UserEntity } from '../user.entity';

export type UserParams = {
  username?: string;
  activated?: string;
};

export type PaginationParams = {
  size?: number;
  page?: number;
};

export type UserSearchParams = {
  activated: string;
};

export type UserQueryParams = UserSearchParams & PaginationParams;

export type AggregatedUsers = PaginationParams & {
  result: UserEntity[];
  total: number;
};
