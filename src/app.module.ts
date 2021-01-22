import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { AppService } from './app.service';
import { AuthorizationModule, RegistrationModule, UserModule } from './modules';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    RegistrationModule,
    AuthorizationModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
