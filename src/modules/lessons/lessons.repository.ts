import { ConflictException, NotFoundException } from '@nestjs/common';
import {
  EntityRepository,
  getMongoRepository,
  ObjectID,
  Repository,
} from 'typeorm';
import { ObjectID as toMongoObjectID } from 'mongodb';

import { LessonsEntity } from './lessons.entity';
import { LessonsAggregation, LessonsAggregationInterface } from './db';
import { CreateLessonDTO, ReadLessonsRequestDTO } from './dto';
import { TypeGetLesson } from './types';
import { TypeSharedGetList } from '../../shared';

@EntityRepository(LessonsEntity)
export class LessonsRepository extends Repository<LessonsEntity> {
  readonly lessonsAggregation: LessonsAggregationInterface;

  constructor() {
    super();

    this.lessonsAggregation = new LessonsAggregation(
      getMongoRepository(LessonsEntity),
    );
  }

  public async createLesson(
    createLessonDTO: CreateLessonDTO,
  ): Promise<TypeGetLesson> {
    const foundLesson = await getMongoRepository(LessonsEntity).findOne({
      name: createLessonDTO.name,
    });

    if (!foundLesson) {
      const createdLesson = Object.assign(new LessonsEntity(), createLessonDTO);

      await createdLesson.save();

      return createdLesson;
    }

    throw new ConflictException(
      `The such lesson "${foundLesson.name}" is exist.`,
    );
  }

  public async getLesson(lessonId: ObjectID): Promise<TypeGetLesson> {
    return await getMongoRepository(LessonsEntity).findOne({
      _id: new toMongoObjectID(lessonId),
    });
  }

  public async getLessons(
    readLessonsRequestDTO: ReadLessonsRequestDTO,
  ): Promise<TypeSharedGetList<TypeGetLesson>> {
    return await this.lessonsAggregation.getLessons(readLessonsRequestDTO);
  }

  public async updateLesson(
    lessonId: ObjectID,
    createLessonDTO: Partial<CreateLessonDTO>,
  ): Promise<TypeGetLesson> {
    const lessonRepository = getMongoRepository(LessonsEntity);

    const updatedLesson = await lessonRepository.updateOne(
      { _id: new toMongoObjectID(lessonId) },
      {
        $set: {
          ...createLessonDTO,
          updatedAt: new Date(),
        },
      },
    );

    if (updatedLesson.result.ok) {
      return this.getLesson(lessonId);
    }
  }

  public async deleteLesson(lessonId: ObjectID): Promise<void> {
    const userRepository = getMongoRepository(LessonsEntity);
    const deletedResponse = await userRepository.deleteOne({
      _id: new toMongoObjectID(lessonId),
    });

    if (!deletedResponse.deletedCount) {
      throw new NotFoundException(`the lesson does not exist`);
    }
  }
}
