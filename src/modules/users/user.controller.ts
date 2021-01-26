import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

import { RolesGuard } from '../../shared/guards/authorization.guard';
import { UserService } from './user.service';
import { UserRoles } from '../../shared/decorators/roles.decorator';

import {
  UpdateUserRequestDTO,
  UpdateUserResponseDTO,
  GetUserResponseDTO,
} from './dto';

@ApiTags('Users')
@UseGuards(RolesGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiBearerAuth()
  @UserRoles('admin')
  @ApiResponse({
    status: 200,
    description: `Return created users`,
    type: [GetUserResponseDTO],
  })
  @Get()
  public async getUsers(): Promise<Array<GetUserResponseDTO>> {
    return await this.userService.getUsers();
  }

  @ApiBearerAuth()
  @UserRoles('admin')
  @ApiResponse({
    status: 200,
    description: `Return updated user`,
    type: UpdateUserResponseDTO,
  })
  @ApiBody({ type: UpdateUserRequestDTO })
  @Patch('/:username')
  public async updateUser(
    @Body() updateUserRequestDTO: Partial<UpdateUserRequestDTO>,
    @Param('username') username: string,
  ): Promise<UpdateUserResponseDTO> {
    return await this.userService.updateUser(username, updateUserRequestDTO);
  }
}
