import { UserParams } from './types';
import { UserEntity } from '../user.entity';
import { ReadUsersResponseDTO } from '../dto';

export interface UsersAggregationInterface {
  getUser(params: UserParams): Promise<UserEntity>;

  getUsers(params: UserParams): Promise<ReadUsersResponseDTO>;
}
