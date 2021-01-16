import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from './user.entity';
import { CreateUserDTO } from './create-user.dto';
import { UserRepository } from './user.repository';
import { ReceiveUserDTO } from './receive-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  public async createUser(createUserDto: CreateUserDTO): Promise<UserEntity> {
    return await this.userRepository.createUser(createUserDto);
  }

  public async getUser(receivedUserDTO: ReceiveUserDTO): Promise<UserEntity> {
    return await this.userRepository.getUser(receivedUserDTO);
  }
}
