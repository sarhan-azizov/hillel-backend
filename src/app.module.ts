import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { AuthorizationModule, RegistrationModule, UserModule } from './modules';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    RegistrationModule,
    AuthorizationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
