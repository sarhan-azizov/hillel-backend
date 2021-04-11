import {
  TypeAggregationOptions,
  TypeGetUserWithPassword,
  TypeGetUser,
} from '../types';

import { TypeSharedGetList } from '../../../shared';
import { ReadUsersRequestDTO } from '../dto';

export interface UsersAggregationInterface {
  getUser(
    params: { username: string },
    aggregationOptions: TypeAggregationOptions,
  ): Promise<TypeGetUserWithPassword>;

  getUsers(
    params: ReadUsersRequestDTO,
  ): Promise<TypeSharedGetList<TypeGetUser>>;
}
