import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { GroupRepository } from './group.repository';
import { CreateGroupRequestDTO } from './create-group-request.dto';
import { CreateGroupResponseDTO } from './create-group-response.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupRepository)
    private groupRepository: GroupRepository,
  ) {}

  public async createGroup(
    createGroupRequestDTO: CreateGroupRequestDTO,
  ): Promise<CreateGroupResponseDTO> {
    return await this.groupRepository.createGroup(createGroupRequestDTO);
  }
}
