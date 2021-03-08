import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { UserRepository } from './user.repository';
import {
  UserChangePasswordRequestDTO,
  UserChangePasswordResponseDTO,
  ReadUserRequestDTO,
  ReadUserResponseDTO,
  ReadUsersRequestDTO,
  ReadUsersResponseDTO,
  UpdateUserRequestDTO,
  UpdateUserResponseDTO,
  CreateUserRequestDTO,
  CreateUserResponseDTO,
} from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  public async changePassword(
    username: string,
    userChangePasswordRequestDTO: UserChangePasswordRequestDTO,
  ): Promise<UserChangePasswordResponseDTO> {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(
      userChangePasswordRequestDTO.password,
      salt,
    );

    return await this.userRepository.updateUser(username, { password });
  }

  public async createUser(
    createUserRequestDTO: CreateUserRequestDTO,
  ): Promise<CreateUserResponseDTO> {
    return await this.userRepository.createUser(createUserRequestDTO);
  }

  public async getUser(
    readUserRequestDTO: ReadUserRequestDTO,
  ): Promise<ReadUserResponseDTO> {
    return await this.userRepository.getUser(readUserRequestDTO);
  }

  public async getUsers(
    readUsersRequestDTO: ReadUsersRequestDTO,
  ): Promise<ReadUsersResponseDTO> {
    return await this.userRepository.getUsers(readUsersRequestDTO);
  }

  public async updateUser(
    username: string,
    updateUserRequestDTO: UpdateUserRequestDTO,
  ): Promise<UpdateUserResponseDTO> {
    return await this.userRepository.updateUser(username, updateUserRequestDTO);
  }

  public async deleteUser(username: string): Promise<void> {
    await this.userRepository.deleteUser(username);
  }
}
