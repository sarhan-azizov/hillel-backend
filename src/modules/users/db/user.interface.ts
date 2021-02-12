import { AggregatedUsers, UserParams } from './types';
import { UserEntity } from '../user.entity';

export interface UsersAggregationInterface {
  getUser(params: UserParams): Promise<UserEntity>;

  getUsers(params: UserParams): Promise<AggregatedUsers>;
}
