import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserEntity } from './user.entity';
import { UserRoles, UserRoleEntity } from '../user-roles';

export default class CreateUser implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const userRepository = connection.getMongoRepository(UserEntity);
    const adminRole = await connection
      .getMongoRepository(UserRoleEntity)
      .findOne({ name: UserRoles.ADMIN });

    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(process.env.ADMIN_USER_PASSWORD, salt);

    await userRepository.insertMany([
      {
        username: process.env.ADMIN_USER_NAME,
        role: adminRole.id,
        firstName: 'admin',
        lastName: 'admin',
        email: process.env.ADMIN_USER_EMAIL,
        password,
        activated: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  }
}
