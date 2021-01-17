import { Controller, Body, Post, Get, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import * as JWT from 'jsonwebtoken';

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
    @Res() response: Response,
  ): Promise<UserEntity> {
    const foundUser = await this.userService.getUser(receivedUserDto);
    const tokenPayload = {};

    const token = JWT.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    response.set('Authorization', 'Bearer ' + token);

    response.send({
      foundUser,
    });

    return foundUser;
  }
}
