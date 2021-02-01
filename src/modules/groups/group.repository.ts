import { Repository, EntityRepository, getMongoRepository } from 'typeorm';

import { GroupEntity } from './group.entity';
import { CreateGroupRequestDTO } from './create-group-request.dto';
import { CreateGroupResponseDTO } from './create-group-response.dto';
import { ConflictException } from '@nestjs/common';

@EntityRepository(GroupEntity)
export class GroupRepository extends Repository<GroupEntity> {
  public async createGroup(
    createGroupRequestDTO: CreateGroupRequestDTO,
  ): Promise<CreateGroupResponseDTO> {
    const foundGroup = await this.getGroupByName(createGroupRequestDTO.name);

    if (!foundGroup) {
      const createdGroup = Object.assign(
        new GroupEntity(),
        createGroupRequestDTO,
      );

      await createdGroup.save();

      return createdGroup;
    }

    throw new ConflictException(`The such group ${foundGroup.name} is exist.`);
  }

  public async getGroupByName(name): Promise<CreateGroupResponseDTO> {
    const groupRepository = getMongoRepository(GroupEntity);

    return await groupRepository.findOne({
      name,
    });
  }
}
