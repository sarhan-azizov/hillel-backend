import { define } from 'typeorm-seeding';

import { UserEntity } from './user.entity';

define(UserEntity, () => {
  const adminUser = new UserEntity();
  adminUser.user = 'admin';
  adminUser.firstName = 'admin';
  adminUser.lastName = 'admin';
  adminUser.email = 'admin@gmail.com';
  adminUser.password = 'admin';
  adminUser.activated = true;

  return adminUser;
});
