import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID } from 'typeorm';

import { LessonsRepository } from './lessons.repository';
import { CreateLessonDTO, ReadLessonsRequestDTO } from './dto';
import { TypeGetLesson } from './types';
import { TypeSharedGetList } from '../../shared';

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

  public async getLessons(
    readLessonsRequestDTO: ReadLessonsRequestDTO,
  ): Promise<TypeSharedGetList<TypeGetLesson>> {
    return await this.lessonsRepository.getLessons(readLessonsRequestDTO);
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
