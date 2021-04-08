import { NotFoundException, ConflictException } from '@nestjs/common';
import { Repository, EntityRepository, getMongoRepository } from 'typeorm';
import { ObjectID } from 'mongodb';

import { UserEntity } from './user.entity';
import {
  CreateUserRequestDTO,
  ReadUsersRequestDTO,
  ReadUserRequestDTO,
  UpdateUserRequestDTO,
} from './dto';

import { UsersAggregationInterface, UsersAggregation } from './db';
import { caseInsensitive } from '../../shared/helpers';
import {
  TypeAggregationOptions,
  TypeGetUser,
  TypeGetUsers,
  TypeGetUserWithPassword,
} from './types';
import { TypeUserRole } from '../user-roles';

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
    defaultUserRole: TypeUserRole,
  ): Promise<TypeGetUser> {
    const foundUser = await this.searchUserByUsername(
      createUserRequestDTO.username,
    );

    if (!foundUser) {
      const createdUser = Object.assign(new UserEntity(), createUserRequestDTO);

      createdUser.role = ObjectID(defaultUserRole.id);

      await createdUser.save();

      return createdUser;
    }

    throw new ConflictException(
      `The such user "${foundUser.username}" is exist.`,
    );
  }

  public async getUser(
    readUserRequestDTO: ReadUserRequestDTO,
    aggregationOptions?: TypeAggregationOptions,
  ): Promise<TypeGetUserWithPassword> {
    const foundUser = await this.usersAggregation.getUser(
      readUserRequestDTO,
      aggregationOptions,
    );

    if (!foundUser) {
      throw new NotFoundException(
        `The user "${readUserRequestDTO.username}" doesn't exist.`,
      );
    }

    return foundUser;
  }

  public async getUsers(
    readUsersRequestDTO: ReadUsersRequestDTO,
  ): Promise<TypeGetUsers> {
    return await this.usersAggregation.getUsers(readUsersRequestDTO);
  }

  private async searchUserByUsername(username): Promise<TypeGetUser> {
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
  ): Promise<TypeGetUser> {
    const userRepository = getMongoRepository(UserEntity);

    if (updateUserRequestDTO.role) {
      updateUserRequestDTO.role = new ObjectID(updateUserRequestDTO.role);
    }

    const updatedUser = await userRepository.findOneAndUpdate(
      { username: caseInsensitive(username) },
      {
        $set: {
          ...updateUserRequestDTO,
          updatedAt: new Date(),
        },
      },
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
