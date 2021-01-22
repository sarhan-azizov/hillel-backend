import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { CreateUserDTO, GetUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  public async createUser(createUserDto: CreateUserDTO): Promise<UserEntity> {
    return await this.userRepository.createUser(createUserDto);
  }

  public async getUser(getUserDto: GetUserDto): Promise<UserEntity> {
    return await this.userRepository.getUser(getUserDto);
  }
}
