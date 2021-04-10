import { LessonsService } from './lessons.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthGuard, UserRolesDecorator } from '../../shared';
import { UserRoles } from '../user-roles';
import { CreateLessonResponseDTO, CreateLessonRequestDTO } from './dto';
import { TypeGetLesson } from './types';

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
    description: `Return lessons`,
    type: [CreateLessonResponseDTO],
  })
  @Post()
  public async createLessons(
    @Body() createLessonRequestDTO: CreateLessonRequestDTO,
  ): Promise<TypeGetLesson> {
    return await this.lessonsService.createLesson(createLessonRequestDTO);
  }
}
