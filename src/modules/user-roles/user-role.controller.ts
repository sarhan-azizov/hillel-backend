import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { RolesGuard } from '../../shared/guards/authorization.guard';
import { UserRoles } from '../../shared/decorators/roles.decorator';

import { UserRoleService } from './user-role.service';
import { GetUserRoleResponseDTO } from './get-user-role-response.dto';

@ApiTags('Roles')
@UseGuards(RolesGuard)
@Controller('roles')
export class UserRoleController {
  constructor(private userRoleService: UserRoleService) {}

  @ApiBearerAuth()
  @UserRoles('admin')
  @ApiResponse({
    status: 200,
    description: `Return user roles`,
    type: [GetUserRoleResponseDTO],
  })
  @Get()
  public async getUserRoles(): Promise<Array<GetUserRoleResponseDTO>> {
    return await this.userRoleService.getUserRoles();
  }
}
