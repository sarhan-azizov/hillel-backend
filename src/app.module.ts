import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Connection } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserEntity } from './modules/users';
import { AuthorizationModule } from './modules/authorization';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env/.development',
    }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      port: 27017,
      host: process.env.MONGO_CONNECTION_HOST,
      username: process.env.MONGO_CONNECTION_USERNAME,
      password: process.env.MONGO_CONNECTION_PASSWORD,
      database: process.env.MONGO_CONNECTION_DATABASE,
      entities: [UserEntity],
      synchronize: Boolean(process.env.MONGO_SYNCHRONIZE),
      useUnifiedTopology: true,
    }),
    AuthorizationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
