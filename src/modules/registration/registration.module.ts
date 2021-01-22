import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from '../users';
import { RegistrationService } from './registration.service';
import { RegistrationController } from './registration.controller';
import { UserRepository } from '../users/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  providers: [UserService, RegistrationService],
  controllers: [RegistrationController],
})
export class RegistrationModule {}
