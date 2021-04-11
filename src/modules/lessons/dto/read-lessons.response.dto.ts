import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ReadLessonDTO } from './read-lesson.dto';

export class ReadLessonsResponseDTO {
  @ApiProperty({
    required: true,
    type: Array,
  })
  @ValidateNested()
  @Type(() => ReadLessonDTO)
  result: ReadLessonDTO[];

  @ApiProperty({
    required: true,
    type: Number,
  })
  @IsNumber()
  total: number;

  @ApiProperty({
    required: true,
    type: Number,
  })
  @IsNumber()
  page: number;

  @ApiProperty({
    required: true,
    type: Number,
  })
  @IsNumber()
  size: number;
}
