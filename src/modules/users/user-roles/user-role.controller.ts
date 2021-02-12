import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { RolesGuard } from '../../../shared/guards/authorization.guard';
import { UserRoles } from '../../../shared/decorators/roles.decorator';

import { UserRoleService } from './user-role.service';
import { ReadUserRolesResponseDTO } from './read-user-roles-response.dto';

@ApiTags('Users')
@UseGuards(RolesGuard)
@Controller('users')
export class UserRoleController {
  constructor(private userRoleService: UserRoleService) {}

  @ApiBearerAuth()
  @ApiBearerAuth()
  @UserRoles('admin')
  @ApiResponse({
    status: 200,
    description: `Return user roles`,
    type: [ReadUserRolesResponseDTO],
  })
  @Get('roles')
  public async getUserRoles(): Promise<Array<ReadUserRolesResponseDTO>> {
    return await this.userRoleService.getUserRoles();
  }
}
