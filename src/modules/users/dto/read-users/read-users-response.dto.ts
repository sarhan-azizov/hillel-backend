import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

import { ReadUserResponseDTO } from '../';

export class ReadUsersResponseDTO {
  @ApiProperty({
    required: true,
    type: Array,
  })
  @IsArray()
  result: ReadUserResponseDTO[];

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
