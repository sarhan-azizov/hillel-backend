import { UserParams } from './types';
import { UserEntity } from '../user.entity';
import { ReadUsersResponseDTO } from '../dto';
import { TypeAggregationOptions } from '../types';

export interface UsersAggregationInterface {
  getUser(
    params: UserParams,
    aggregationOptions: TypeAggregationOptions,
  ): Promise<UserEntity>;

  getUsers(params: UserParams): Promise<ReadUsersResponseDTO>;
}
