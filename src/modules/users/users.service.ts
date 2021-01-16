import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from './users.entity';
import { CreateUserDTO } from './create-user.dto';
import { UserRepository } from './users.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  public async createUser(createUserDto: CreateUserDTO): Promise<UserEntity> {
    return await this.userRepository.createUser(createUserDto);
  }
}
