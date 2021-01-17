import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { RoleEntity, UserRoles } from './role.entity';

export default class CreateRoles implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const roleRepository = connection.getMongoRepository(RoleEntity);

    await roleRepository.insertMany([
      { name: UserRoles.ADMIN },
      { name: UserRoles.STUDENT },
      { name: UserRoles.MENTOR },
    ]);
  }
}
