import { Controller, Body, Post, Get, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import * as JWT from 'jsonwebtoken';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

import {
  UserService,
  UserEntity,
  CreateUserDTO,
  ReceiveUserDTO,
} from '../users';

@ApiTags('Authorization')
@Controller()
export class AuthorizationController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: 201,
    description: `Return registered user`,
    type: [CreateUserDTO],
  })
  @ApiParam({ name: 'user', type: 'string', description: 'unique user name' })
  @ApiParam({
    name: 'firstName',
    type: 'string',
    required: false,
  })
  @ApiParam({
    name: 'lastName',
    type: 'string',
    required: false,
  })
  @ApiParam({
    name: 'email',
    type: 'string',
    required: false,
  })
  @ApiParam({
    name: 'password',
    type: 'string',
  })
  @Post('registration')
  public async registration(
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<UserEntity> {
    return await this.userService.createUser(createUserDTO);
  }

  @ApiOperation({ summary: 'User authorization' })
  @ApiResponse({
    status: 200,
    description: `Return authorized user`,
    type: [CreateUserDTO],
  })
  @ApiQuery({ name: 'user', type: 'string' })
  @ApiQuery({ name: 'password', type: 'string' })
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
