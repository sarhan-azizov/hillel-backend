import { TypeGetLesson } from '../types';

import { TypeSharedGetList } from '../../../shared';
import { ReadLessonsRequestDTO } from '../dto';

export interface LessonsAggregationInterface {
  getLessons(
    params: ReadLessonsRequestDTO,
  ): Promise<TypeSharedGetList<TypeGetLesson>>;
}
