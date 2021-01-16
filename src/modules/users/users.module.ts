import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './users.service';
import { UserController } from './users.controller';
import { UserRepository } from './users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
