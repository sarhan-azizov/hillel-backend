import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiCookieAuth,
} from '@nestjs/swagger';

import { AuthGuard } from '../../shared/guards/authorization.guard';
import { UserRoles } from '../../shared/decorators/roles.decorator';

import { UserRoleService } from './user-role.service';
import { ReadUserRolesResponseDTO } from './read-user-roles-response.dto';
import { TypeUserRole } from './types';

@ApiTags('User Roles')
@UseGuards(AuthGuard)
@Controller('user-roles')
export class UserRoleController {
  constructor(private userRoleService: UserRoleService) {}

  @ApiCookieAuth()
  @ApiBearerAuth()
  @UserRoles('admin')
  @ApiResponse({
    status: 200,
    description: `Return user roles`,
    type: [ReadUserRolesResponseDTO],
  })
  @Get()
  public async getUserRoles(): Promise<TypeUserRole[]> {
    return await this.userRoleService.getUserRoles();
  }
}
