import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { AuthGuard } from '../../shared/guards/authorization.guard';
import { UserRolesDecorator } from '../../shared/decorators/roles.decorator';

import { GroupService } from './group.service';
import { CreateGroupRequestDTO } from './create-group-request.dto';
import { CreateGroupResponseDTO } from './create-group-response.dto';
import { UserRoles } from '../user-roles';

@ApiTags('Groups')
@UseGuards(AuthGuard)
@Controller('groups')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @ApiBearerAuth()
  @ApiBearerAuth()
  @UserRolesDecorator(UserRoles.ADMIN, UserRoles.MENTOR)
  @ApiResponse({
    status: 200,
    description: `Return user roles`,
    type: CreateGroupResponseDTO,
  })
  @Post()
  public async createGroup(
    @Body() createGroupRequestDTO: CreateGroupRequestDTO,
  ): Promise<CreateGroupResponseDTO> {
    return await this.groupService.createGroup(createGroupRequestDTO);
  }
}
