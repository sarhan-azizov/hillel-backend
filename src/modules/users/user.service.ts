import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { UserRepository } from './user.repository';
import {
  UserChangePasswordRequestDTO,
  ReadUserRequestDTO,
  ReadUsersRequestDTO,
  UpdateUserRequestDTO,
  CreateUserRequestDTO,
} from './dto';

import {
  TypeAggregationOptions,
  TypeGetUser,
  TypeGetUsers,
  TypeGetUserWithPassword,
} from './types';

import { UserRoleService } from '../user-roles';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly userRoleService: UserRoleService,
  ) {}

  public async changePassword(
    username: string,
    userChangePasswordRequestDTO: UserChangePasswordRequestDTO,
  ): Promise<TypeGetUser> {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(
      userChangePasswordRequestDTO.password,
      salt,
    );

    return await this.userRepository.updateUser(username, { password });
  }

  public async createUser(
    createUserRequestDTO: CreateUserRequestDTO,
  ): Promise<TypeGetUser> {
    const defaultUserRole = await this.userRoleService.getDefaultUserRole();
    return await this.userRepository.createUser(
      createUserRequestDTO,
      defaultUserRole,
    );
  }

  public async getUser(
    readUserRequestDTO: ReadUserRequestDTO,
    aggregationOptions?: TypeAggregationOptions,
  ): Promise<TypeGetUserWithPassword> {
    return await this.userRepository.getUser(
      readUserRequestDTO,
      aggregationOptions,
    );
  }

  public async getUsers(
    readUsersRequestDTO: ReadUsersRequestDTO,
  ): Promise<TypeGetUsers> {
    return await this.userRepository.getUsers(readUsersRequestDTO);
  }

  public async updateUser(
    username: string,
    updateUserRequestDTO: UpdateUserRequestDTO,
  ): Promise<TypeGetUser> {
    return await this.userRepository.updateUser(username, updateUserRequestDTO);
  }

  public async deleteUser(username: string): Promise<void> {
    await this.userRepository.deleteUser(username);
  }
}
