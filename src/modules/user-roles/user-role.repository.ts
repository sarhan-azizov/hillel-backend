import { Repository, EntityRepository, getMongoRepository } from 'typeorm';

import { UserRoleEntity, UserRoles } from './user-role.entity';
import { TypeUserRole } from './types';

@EntityRepository(UserRoleEntity)
export class UserRoleRepository extends Repository<UserRoleEntity> {
  public async getUserRoles(): Promise<TypeUserRole[]> {
    const userRoleRepository = getMongoRepository(UserRoleEntity);

    return await userRoleRepository.find();
  }

  public async getDefaultUserRole(): Promise<TypeUserRole> {
    const userRoleRepository = getMongoRepository(UserRoleEntity);

    return await userRoleRepository.findOne({
      name: UserRoles.STUDENT,
    });
  }
}
