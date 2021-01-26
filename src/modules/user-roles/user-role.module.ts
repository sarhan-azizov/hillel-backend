import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRoleService } from './user-role.service';
import { UserRoleRepository } from './user-role.repository';
import { UserRoleController } from './user-role.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserRoleRepository])],
  providers: [UserRoleService],
  controllers: [UserRoleController],
})
export class UserRoleModule {}
