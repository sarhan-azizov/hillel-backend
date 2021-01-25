import { Controller, Body, Post, Get, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { RolesGuard } from '../../shared/guards/authorization.guard';
import { UserService } from './user.service';
import { Roles } from '../../shared/decorators/roles.decorator';

import {
  CreateUserRequestDTO,
  CreateUserResponseDTO,
  GetUserResponseDTO,
} from './dto';

@ApiTags('Users')
@UseGuards(RolesGuard)
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

  @ApiBearerAuth()
  @Roles('admin')
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
