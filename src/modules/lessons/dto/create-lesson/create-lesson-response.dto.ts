import { ApiProperty } from '@nestjs/swagger';

import {
  IsBoolean,
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ObjectID } from 'typeorm';

export class CreateLessonResponseDTO {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsMongoId()
  id: ObjectID;

  @ApiProperty({
    required: true,
    maxLength: 120,
    minLength: 5,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(120)
  name: string;

  @ApiProperty({
    required: true,
    maxLength: 500,
    minLength: 5,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(500)
  description: string;

  @ApiProperty({ required: true, type: 'boolean' })
  @IsBoolean()
  activated: boolean;

  @ApiProperty({ required: true, type: Date })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ required: true, type: Date })
  @IsDate()
  updatedAt: Date;
}
