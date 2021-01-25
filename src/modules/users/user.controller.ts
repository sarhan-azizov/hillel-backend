import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { RolesGuard } from '../../shared/guards/authorization.guard';
import { UserService } from './user.service';
import { Roles } from '../../shared/decorators/roles.decorator';

import { GetUserResponseDTO } from './dto';

@ApiTags('Users')
@UseGuards(RolesGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

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
