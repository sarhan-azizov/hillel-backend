import { NotFoundException, ConflictException } from '@nestjs/common';
import { Repository, EntityRepository, getMongoRepository } from 'typeorm';

import { UserEntity } from './user.entity';
import {
  CreateUserRequestDTO,
  ReadUsersRequestDTO,
  ReadUserRequestDTO,
  UpdateUserRequestDTO,
  ReadUsersResponseDTO,
} from './dto';
import { UsersAggregationInterface, UsersAggregation } from './db';
import { caseInsensitive } from '../../shared/helpers';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  readonly usersAggregation: UsersAggregationInterface;

  constructor() {
    super();

    this.usersAggregation = new UsersAggregation(
      getMongoRepository(UserEntity),
    );
  }

  public async createUser(
    createUserRequestDTO: CreateUserRequestDTO,
  ): Promise<UserEntity> {
    const foundUser = await this.searchUserByUsername(
      createUserRequestDTO.username,
    );

    if (!foundUser) {
      const createdUser = Object.assign(new UserEntity(), createUserRequestDTO);

      await createdUser.save();

      return createdUser;
    }

    throw new ConflictException(
      `The such user "${foundUser.username}" is exist.`,
    );
  }

  public async getUser(
    readUserRequestDTO: ReadUserRequestDTO,
  ): Promise<UserEntity> {
    const foundUser = await this.usersAggregation.getUser(readUserRequestDTO);

    if (!foundUser) {
      throw new NotFoundException(
        `The user "${readUserRequestDTO.username}" doesn't exist.`,
      );
    }

    return foundUser;
  }

  public async getUsers(
    readUsersRequestDTO: ReadUsersRequestDTO,
  ): Promise<ReadUsersResponseDTO> {
    return await this.usersAggregation.getUsers(readUsersRequestDTO);
  }

  private async searchUserByUsername(username): Promise<UserEntity> {
    const userRepository = getMongoRepository(UserEntity);

    return await userRepository.findOne({
      where: {
        username: caseInsensitive(username),
      },
    });
  }

  public async updateUser(
    username: string,
    updateUserRequestDTO: Partial<UpdateUserRequestDTO>,
  ): Promise<UserEntity> {
    const userRepository = getMongoRepository(UserEntity);
    const updatedUser = await userRepository.findOneAndUpdate(
      { username: caseInsensitive(username) },
      { $set: updateUserRequestDTO },
    );

    if (updatedUser.ok) {
      return this.getUser({ username });
    }
  }

  public async deleteUser(username: string): Promise<void> {
    const userRepository = getMongoRepository(UserEntity);
    const deletedResponse = await userRepository.deleteOne({
      username: caseInsensitive(username),
    });

    if (!deletedResponse.deletedCount) {
      throw new NotFoundException(`the username "${username}" does not exist`);
    }
  }
}
