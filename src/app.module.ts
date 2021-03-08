import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { UserModule, AuthModule, GroupModule } from './modules';

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule, AuthModule, GroupModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
