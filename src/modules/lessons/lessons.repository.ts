import { ConflictException } from '@nestjs/common';
import { EntityRepository, getMongoRepository, Repository } from 'typeorm';

import { LessonsEntity } from './lessons.entity';
import { CreateLessonRequestDTO } from './dto';
import { TypeGetLesson } from './types';

@EntityRepository(LessonsEntity)
export class LessonsRepository extends Repository<LessonsEntity> {
  public async createLesson(
    createLessonRequestDTO: CreateLessonRequestDTO,
  ): Promise<TypeGetLesson> {
    const foundLesson = await getMongoRepository(LessonsEntity).findOne({
      name: createLessonRequestDTO.name,
    });

    if (!foundLesson) {
      const createdLesson = Object.assign(
        new LessonsEntity(),
        createLessonRequestDTO,
      );

      await createdLesson.save();

      return createdLesson;
    }

    throw new ConflictException(
      `The such lesson "${foundLesson.name}" is exist.`,
    );
  }
}
