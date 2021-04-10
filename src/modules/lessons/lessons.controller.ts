import { LessonsService } from './lessons.service';
import {
  Body,
  Controller,
  Param,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthGuard, TypeSharedDelete, UserRolesDecorator } from '../../shared';
import { UserRoles } from '../user-roles';
import { CreateLessonDTO, ReadLessonDTO } from './dto';
import { TypeGetLesson } from './types';
import { ObjectID } from 'typeorm';

@ApiTags('Lessons')
@UseGuards(AuthGuard)
@Controller('lessons')
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @ApiCookieAuth()
  @ApiBearerAuth()
  @UserRolesDecorator(UserRoles.ADMIN, UserRoles.MENTOR)
  @ApiResponse({
    status: 200,
    description: `Create lesson`,
    type: [ReadLessonDTO],
  })
  @Post()
  public async createLessons(
    @Body() createLessonDTO: CreateLessonDTO,
  ): Promise<TypeGetLesson> {
    return await this.lessonsService.createLesson(createLessonDTO);
  }

  // @ApiCookieAuth()
  // @ApiBearerAuth()
  // @UserRolesDecorator(UserRoles.ADMIN, UserRoles.MENTOR)
  @ApiResponse({
    status: 200,
    description: `Return lesson`,
    type: [ReadLessonDTO],
  })
  @Get('/:lessonId')
  public async getLesson(
    @Param('lessonId') lessonId: ObjectID,
  ): Promise<TypeGetLesson> {
    return await this.lessonsService.getLesson(lessonId);
  }

  // @ApiCookieAuth()
  // @ApiBearerAuth()
  // @UserRolesDecorator(UserRoles.ADMIN, UserRoles.MENTOR)
  @ApiResponse({
    status: 200,
    description: `Return updated lesson`,
    type: [ReadLessonDTO],
  })
  @ApiBody({ type: CreateLessonDTO })
  @Patch('/:lessonId')
  public async updateLesson(
    @Param('lessonId') lessonId: ObjectID,
    @Body() createLessonDTO: Partial<CreateLessonDTO>,
  ): Promise<TypeGetLesson> {
    return await this.lessonsService.updateLesson(lessonId, createLessonDTO);
  }

  // @ApiCookieAuth()
  // @ApiBearerAuth()
  // @UserRolesDecorator(UserRoles.ADMIN, UserRoles.MENTOR)
  @ApiResponse({
    status: 200,
    description: `Return lesson`,
    type: [ReadLessonDTO],
  })
  @Delete('/:lessonId')
  public async deleteLesson(
    @Param('lessonId') lessonId: ObjectID,
  ): Promise<TypeSharedDelete> {
    await this.lessonsService.deleteLesson(lessonId);

    return {
      status: 200,
      msg: `the lesson "${lessonId}" succeed deleted`,
    };
  }
}
