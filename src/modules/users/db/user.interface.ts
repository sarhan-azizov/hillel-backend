import { UserParams } from './types';
import {
  TypeAggregationOptions,
  TypeGetUsers,
  TypeGetUserWithPassword,
} from '../types';

export interface UsersAggregationInterface {
  getUser(
    params: UserParams,
    aggregationOptions: TypeAggregationOptions,
  ): Promise<TypeGetUserWithPassword>;

  getUsers(params: UserParams): Promise<TypeGetUsers>;
}
