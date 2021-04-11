import { MongoRepository } from 'typeorm';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

import { LessonsEntity } from '../lessons.entity';
import { LessonsAggregationInterface } from './lessons-aggregation.interface';
import {
  ReadLessonDTO,
  ReadLessonsRequestDTO,
  ReadLessonsResponseDTO,
} from '../dto';
import { TypeGetLesson } from '../types';
import { TypeSharedGetList } from '../../../shared';

export class LessonsAggregation implements LessonsAggregationInterface {
  private lessonsRepository: MongoRepository<LessonsEntity>;

  constructor(lessonsRepository: MongoRepository<LessonsEntity>) {
    this.lessonsRepository = lessonsRepository;
  }

  private getAggregatedResponse(
    aggregatedResult,
    params,
  ): TypeSharedGetList<TypeGetLesson> {
    const aggregatedList = aggregatedResult.length
      ? aggregatedResult[0]
      : { result: [], total: [{ total: 0 }], page: 0, size: 10 };

    return {
      result: aggregatedList.result,
      total: aggregatedList.total[0]?.total | 0,
      page: params.page,
      size: params.size,
    };
  }

  private async getAggregatedLessons({
    page = 1,
    size = 10,
    activated,
  }: ReadLessonsRequestDTO = {}): Promise<TypeSharedGetList<TypeGetLesson>> {
    const $skip = size * (page - 1);
    const $limit = size + $skip;

    const aggregationResult = [
      { $match: { activated } },
      { $sort: { username: 1 } },
      { $limit },
      { $skip },
    ];

    const aggregationTotal = [{ $match: { activated } }, { $count: 'total' }];

    if (activated === undefined) {
      aggregationResult.shift();
      aggregationTotal.shift();
    }

    const aggregatedResult: ReadLessonDTO[] = await this.lessonsRepository
      .aggregate([
        { $facet: { result: aggregationResult, total: aggregationTotal } },
      ])
      .toArray();

    return this.getAggregatedResponse(aggregatedResult, { page, size });
  }

  public async getLessons(
    params: ReadLessonsRequestDTO,
  ): Promise<TypeSharedGetList<TypeGetLesson>> {
    const lessons = await this.getAggregatedLessons(params);

    const errors = await validate(
      plainToClass(ReadLessonsResponseDTO, lessons),
    );

    if (errors.length) {
      throw new Error(JSON.stringify(errors, null, 2));
    }

    return lessons;
  }
}
