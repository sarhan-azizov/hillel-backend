import { Controller, Body, Post } from '@nestjs/common';

import { CreateUserDTO } from './create-user.dto';
import { UserEntity } from './users.entity';
import { UserService } from './users.service';

@Controller('registration')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  public async createUser(
    @Body() createUserDto: CreateUserDTO,
  ): Promise<UserEntity> {
    return await this.userService.createUser(createUserDto);
  }
}
