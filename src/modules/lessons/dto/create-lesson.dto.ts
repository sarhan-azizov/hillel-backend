import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateLessonDTO {
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
}
