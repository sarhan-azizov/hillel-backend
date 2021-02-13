import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserRoleRepository } from './user-role.repository';
import { ReadUserRolesResponseDTO } from './read-user-roles-response.dto';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRoleRepository)
    private userRoleRepository: UserRoleRepository,
  ) {}

  public async getUserRoles(): Promise<Array<ReadUserRolesResponseDTO>> {
    return await this.userRoleRepository.getUserRoles();
  }
}
