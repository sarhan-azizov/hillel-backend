import { Controller, Body, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';

import { UserService } from './user.service';
import { CreateUserDTO } from './create-user.dto';
import { UserEntity } from './user.entity';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: 201,
    description: `Return registered user`,
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
}
