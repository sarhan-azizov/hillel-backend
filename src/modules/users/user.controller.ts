import { Controller, Body, Post, Query, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';

import { UserService } from './user.service';
import { CreateUserDTO, GetUserDto } from './dto';
import { UserEntity } from './user.entity';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Users' })
  @ApiResponse({
    status: 201,
    description: `Return created user`,
    type: [CreateUserDTO],
  })
  @ApiParam({
    name: 'user',
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
  @Post()
  public async createUser(
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<UserEntity> {
    return await this.userService.createUser(createUserDTO);
  }

  @ApiResponse({
    status: 200,
    description: `Return all users`,
    type: [CreateUserDTO],
  })
  @ApiParam({
    name: 'user',
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
  public async getUsers(@Query() getUserDto: GetUserDto): Promise<UserEntity> {
    return await this.userService.getUser(getUserDto);
  }
}
