import { Repository, EntityRepository, getMongoRepository } from 'typeorm';

import { UserRoleEntity } from './user-role.entity';
import { GetUserRoleResponseDTO } from './get-user-role-response.dto';

@EntityRepository(UserRoleEntity)
export class UserRoleRepository extends Repository<UserRoleEntity> {
  public async getUserRoles(): Promise<Array<GetUserRoleResponseDTO>> {
    const userRoleRepository = getMongoRepository(UserRoleEntity);
    const userRoles = await userRoleRepository.find();

    return userRoles;
  }
}
