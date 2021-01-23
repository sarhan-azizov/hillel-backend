import { NotFoundException, ConflictException } from '@nestjs/common';
import { Repository, EntityRepository, getMongoRepository } from 'typeorm';

import { UserEntity } from './user.entity';
import { CreateUserRequestDTO, GetUserRequestDTO } from './dto';
import { getUserWithRole } from './aggregation';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  public async createUser(
    createUserRequestDTO: CreateUserRequestDTO,
  ): Promise<UserEntity> {
    const foundUser = await this.getUserByUserField(
      createUserRequestDTO.username,
    );

    if (!foundUser) {
      const createdUser = Object.assign(new UserEntity(), createUserRequestDTO);

      await createdUser.save();

      return createdUser;
    }

    throw new ConflictException(
      `The such user ${foundUser.username} is exist.`,
    );
  }

  public async getUser(
    getUserRequestDTO: GetUserRequestDTO,
  ): Promise<UserEntity> {
    const userRepository = getMongoRepository(UserEntity);
    const foundUserWithRole = await getUserWithRole(
      userRepository,
      getUserRequestDTO.username,
    );

    if (!foundUserWithRole) {
      throw new NotFoundException();
    }

    return foundUserWithRole;
  }

  public async getUserByUserField(username): Promise<UserEntity> {
    const userRepository = getMongoRepository(UserEntity);
    const foundUser = await userRepository.findOne({
      username,
    });

    return foundUser;
  }
}
