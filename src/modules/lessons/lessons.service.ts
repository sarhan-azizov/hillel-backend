import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateLessonDTO } from './dto';
import { TypeGetLesson } from './types';
import { LessonsRepository } from './lessons.repository';
import { ObjectID } from 'typeorm';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(LessonsRepository)
    private readonly lessonsRepository: LessonsRepository,
  ) {}

  public async createLesson(
    createLessonDTO: CreateLessonDTO,
  ): Promise<TypeGetLesson> {
    return await this.lessonsRepository.createLesson(createLessonDTO);
  }

  public async getLesson(lessonId: ObjectID): Promise<TypeGetLesson> {
    return await this.lessonsRepository.getLesson(lessonId);
  }

  public async updateLesson(
    lessonId: ObjectID,
    createLessonDTO: Partial<CreateLessonDTO>,
  ): Promise<TypeGetLesson> {
    return await this.lessonsRepository.updateLesson(lessonId, createLessonDTO);
  }

  public async deleteLesson(lessonId: ObjectID): Promise<void> {
    return await this.lessonsRepository.deleteLesson(lessonId);
  }
}
