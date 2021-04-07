import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { AuthGuard } from '../../shared/guards/authorization.guard';
import { UserRoles } from '../../shared/decorators/roles.decorator';

import { GroupService } from './group.service';
import { CreateGroupRequestDTO } from './create-group-request.dto';
import { CreateGroupResponseDTO } from './create-group-response.dto';

@ApiTags('Groups')
@UseGuards(AuthGuard)
@Controller('groups')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @ApiBearerAuth()
  @ApiBearerAuth()
  @UserRoles('admin')
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
