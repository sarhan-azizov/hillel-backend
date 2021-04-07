import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ReadUserResponseDTO } from '../';

export class ReadUsersResponseDTO {
  @ApiProperty({
    required: true,
    type: Array,
  })
  @ValidateNested()
  @Type(() => ReadUserResponseDTO)
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
