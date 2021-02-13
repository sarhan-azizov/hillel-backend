import { Repository, EntityRepository, getMongoRepository } from 'typeorm';

import { UserRoleEntity } from './user-role.entity';
import { ReadUserRolesResponseDTO } from './read-user-roles-response.dto';

@EntityRepository(UserRoleEntity)
export class UserRoleRepository extends Repository<UserRoleEntity> {
  public async getUserRoles(): Promise<ReadUserRolesResponseDTO[]> {
    const userRoleRepository = getMongoRepository(UserRoleEntity);
    const userRoles = await userRoleRepository.find();

    return userRoles;
  }
}
