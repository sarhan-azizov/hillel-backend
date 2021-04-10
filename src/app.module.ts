import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import {
  UserModule,
  AuthModule,
  GroupModule,
  UserRoleModule,
  LessonsModule,
} from './modules';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    AuthModule,
    GroupModule,
    UserRoleModule,
    LessonsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
