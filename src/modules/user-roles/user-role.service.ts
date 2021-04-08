import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserRoleRepository } from './user-role.repository';
import { TypeUserRole } from './types';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRoleRepository)
    private userRoleRepository: UserRoleRepository,
  ) {}

  public async getUserRoles(): Promise<TypeUserRole[]> {
    return await this.userRoleRepository.getUserRoles();
  }

  public async getDefaultUserRole(): Promise<TypeUserRole> {
    return await this.userRoleRepository.getDefaultUserRole();
  }
}
