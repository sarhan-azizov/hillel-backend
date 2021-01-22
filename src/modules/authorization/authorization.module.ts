import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthorizationController } from './authorization.controller';
import { UserService } from '../users';
import { AuthorizationService } from './authorization.service';
import { UserRepository } from '../users/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  providers: [AuthorizationService, UserService],
  controllers: [AuthorizationController],
})
export class AuthorizationModule {}
