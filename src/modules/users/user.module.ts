import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';

import { UserRoleService } from '../user-roles';
import { UserRoleRepository } from '../user-roles/user-role.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, UserRoleRepository])],
  exports: [UserService],
  providers: [UserService, UserRoleService],
  controllers: [UserController],
})
export class UserModule {}
