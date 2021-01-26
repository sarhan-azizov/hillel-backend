import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { UserRoleEntity, UserRoles } from '../user-roles/user-role.entity';

export default class CreateUserRoles implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const userRoleRepository = connection.getMongoRepository(UserRoleEntity);

    await userRoleRepository.insertMany([
      { name: UserRoles.ADMIN },
      { name: UserRoles.STUDENT },
      { name: UserRoles.MENTOR },
    ]);
  }
}
