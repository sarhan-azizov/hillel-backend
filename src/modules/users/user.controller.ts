import { Controller, Body, Post, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';

import { UserService } from './user.service';
import { CreateUserRequestDTO, CreateUserResponseDTO } from './dto';
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

  @ApiResponse({
    status: 200,
    description: `Return created users`,
    type: [CreateUserResponseDTO],
  })
  @Get()
  public async getUsers(): Promise<Array<UserEntity>> {
    return await this.userService.getUsers();
  }
}
