import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { UserEntity } from './user.entity';
import { RoleEntity } from '../roles';
import { UserRoles } from '../roles/role.entity';

export default class CreateUser implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const userRepository = connection.getMongoRepository(UserEntity);
    const adminRole = await connection
      .getMongoRepository(RoleEntity)
      .findOne({ name: UserRoles.ADMIN });

    await userRepository.insertMany([
      {
        user: 'admin',
        role: adminRole.id,
        firstName: 'admin',
        lastName: 'admin',
        email: 'admin@gmail.com',
        password: 'admin',
        activated: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  }
}
