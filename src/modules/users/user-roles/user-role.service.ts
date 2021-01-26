import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserRoleRepository } from './user-role.repository';
import { GetUserRoleResponseDTO } from './get-user-role-response.dto';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRoleRepository)
    private userRoleRepository: UserRoleRepository,
  ) {}

  public async getUserRoles(): Promise<Array<GetUserRoleResponseDTO>> {
    return await this.userRoleRepository.getUserRoles();
  }
}
