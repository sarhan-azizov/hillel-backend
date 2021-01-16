import {
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Repository, EntityRepository, getMongoRepository } from 'typeorm';

import { UserEntity } from './user.entity';
import { CreateUserDTO } from './create-user.dto';
import { ReceiveUserDTO } from './receive-user.dto';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  public async createUser(createUserDTO: CreateUserDTO): Promise<UserEntity> {
    const createdUser = Object.assign(new UserEntity(), createUserDTO);

    await createdUser.save();

    return createdUser;
  }

  public async getUser(receivedUserDTO: ReceiveUserDTO): Promise<UserEntity> {
    const userRepository = getMongoRepository(UserEntity);
    const foundUser = await userRepository.findOne({
      user: receivedUserDTO.user,
    });

    if (!foundUser) {
      throw new NotFoundException();
    }

    if (foundUser.password !== receivedUserDTO.password) {
      throw new UnauthorizedException();
    }

    if (!foundUser.activated) {
      throw new ForbiddenException();
    }

    return foundUser;
  }
}
