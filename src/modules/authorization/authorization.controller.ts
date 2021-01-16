import { Controller, Body, Post, Get, Query } from '@nestjs/common';

import {
  UserService,
  UserEntity,
  CreateUserDTO,
  ReceiveUserDTO,
} from '../users';

@Controller()
export class AuthorizationController {
  constructor(private userService: UserService) {}

  @Post('registration')
  public async registration(
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<UserEntity> {
    return await this.userService.createUser(createUserDTO);
  }

  @Get('authorization')
  public async authorization(
    @Query() receivedUserDto: ReceiveUserDTO,
  ): Promise<UserEntity> {
    return await this.userService.getUser(receivedUserDto);
  }
}
