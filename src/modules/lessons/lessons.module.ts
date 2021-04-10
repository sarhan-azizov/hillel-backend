import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LessonsRepository } from './lessons.repository';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LessonsRepository])],
  providers: [LessonsService],
  controllers: [LessonsController],
})
export class LessonsModule {}
