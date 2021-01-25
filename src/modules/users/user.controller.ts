import { Controller, Body, Post, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';

import { UserService } from './user.service';
import {
  CreateUserRequestDTO,
  CreateUserResponseDTO,
  GetUserResponseDTO,
} from './dto';

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
  ): Promise<CreateUserResponseDTO> {
    return await this.userService.createUser(createUserRequestDTO);
  }

  @ApiResponse({
    status: 200,
    description: `Return created users`,
    type: [GetUserResponseDTO],
  })
  @Get()
  public async getUsers(): Promise<Array<GetUserResponseDTO>> {
    return await this.userService.getUsers();
  }
}
