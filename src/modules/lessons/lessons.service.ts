import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateLessonRequestDTO } from './dto';
import { TypeGetLesson } from './types';
import { LessonsRepository } from './lessons.repository';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(LessonsRepository)
    private readonly lessonsRepository: LessonsRepository,
  ) {}

  public async createLesson(
    createLessonRequestDTO: CreateLessonRequestDTO,
  ): Promise<TypeGetLesson> {
    return await this.lessonsRepository.createLesson(createLessonRequestDTO);
  }
}
