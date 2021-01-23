import { Controller, Body, Post, Query, Get } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import { UserService } from './user.service';
import {
  CreateUserRequestDTO,
  CreateUserResponseDTO,
  GetUserResponseDTO,
  GetUserRequestDTO,
} from './dto';
import { UserEntity } from './user.entity';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Users' })
  @ApiBody({ type: CreateUserRequestDTO })
  @ApiResponse({
    status: 201,
    description: `Return created user`,
    type: CreateUserResponseDTO,
  })
  @Post()
  public async createUser(
    @Body() createUserRequestDTO: CreateUserRequestDTO,
  ): Promise<UserEntity> {
    return await this.userService.createUser(createUserRequestDTO);
  }

  @ApiParam({
    name: 'username',
    type: 'string',
    description: 'the username is unique ',
  })
  @ApiParam({
    name: 'firstName',
    type: 'string',
  })
  @ApiParam({
    name: 'lastName',
    type: 'string',
  })
  @ApiParam({
    name: 'email',
    type: 'string',
  })
  @ApiParam({
    name: 'password',
    type: 'string',
  })
  @Get()
  public async getUsers(
    @Query() getUserRequestDTO: GetUserRequestDTO,
  ): Promise<UserEntity> {
    return await this.userService.getUser(getUserRequestDTO);
  }
}
