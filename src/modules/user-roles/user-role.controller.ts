import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiCookieAuth,
} from '@nestjs/swagger';

import { AuthGuard, UserRolesDecorator } from '../../shared';

import { UserRoleService } from './user-role.service';
import { ReadUserRolesResponseDTO } from './read-user-roles-response.dto';
import { TypeUserRole } from './types';
import { UserRoles } from './user-role.entity';

@ApiTags('User Roles')
@UseGuards(AuthGuard)
@Controller('user-roles')
export class UserRoleController {
  constructor(private userRoleService: UserRoleService) {}

  @ApiCookieAuth()
  @ApiBearerAuth()
  @UserRolesDecorator(UserRoles.ADMIN, UserRoles.MENTOR)
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
