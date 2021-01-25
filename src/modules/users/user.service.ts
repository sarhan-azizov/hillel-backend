import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import {
  CreateUserRequestDTO,
  CreateUserResponseDTO,
  GetUserRequestDTO,
  GetUserResponseDTO,
} from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  public async createUser(
    createUserRequestDTO: CreateUserRequestDTO,
  ): Promise<CreateUserResponseDTO> {
    return await this.userRepository.createUser(createUserRequestDTO);
  }

  public async getUser(
    getUserRequestDTO: GetUserRequestDTO,
  ): Promise<UserEntity> {
    return await this.userRepository.getUser(getUserRequestDTO);
  }

  public async getUsers(): Promise<Array<GetUserResponseDTO>> {
    return await this.userRepository.getUsers();
  }
}
