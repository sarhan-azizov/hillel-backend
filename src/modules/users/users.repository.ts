import { Repository, EntityRepository } from 'typeorm';

import { UserEntity } from './users.entity';
import { CreateUserDTO } from './create-user.dto';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  public async createUser(createUserDTO: CreateUserDTO): Promise<UserEntity> {
    const createdUser = Object.assign(new UserEntity(), createUserDTO);

    await createdUser.save();

    return createdUser;
  }
}
