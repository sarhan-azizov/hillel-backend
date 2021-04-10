import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as faker from 'faker';

import { UserEntity } from '../user.entity';
import { UserRoles, UserRoleEntity } from '../../user-roles';

export default class CreateUser implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const userRepository = connection.getMongoRepository(UserEntity);
    const adminRole = await connection
      .getMongoRepository(UserRoleEntity)
      .findOne({ name: UserRoles.ADMIN });

    const salt = await bcrypt.genSalt();
    const adminUser = {
      username: process.env.ADMIN_USER_NAME,
      role: adminRole._id,
      firstName: 'admin',
      lastName: 'admin',
      email: process.env.ADMIN_USER_EMAIL,
      password: await bcrypt.hash(process.env.ADMIN_USER_PASSWORD, salt),
      activated: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const password = await bcrypt.hash('qwerty', salt);
    const mockedUsers = Array.from(Array(20).keys(), () => ({
      username: faker.internet.userName(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      role: null,
      password,
      activated: faker.random.boolean(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await userRepository.insertMany([adminUser, ...mockedUsers]);
  }
}
