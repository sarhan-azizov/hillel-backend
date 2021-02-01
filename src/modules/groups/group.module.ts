import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroupService } from './group.service';
import { GroupRepository } from './group.repository';
import { GroupController } from './group.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GroupRepository])],
  providers: [GroupService],
  controllers: [GroupController],
})
export class GroupModule {}
