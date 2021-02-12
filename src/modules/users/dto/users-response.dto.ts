import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

import { UserResponseDTO } from './user-response.dto';

export class UsersResponseDTO {
  @ApiProperty({
    required: true,
    type: Array,
  })
  @IsArray()
  result: UserResponseDTO[];

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
