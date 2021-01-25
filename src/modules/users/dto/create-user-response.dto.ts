import { ApiProperty } from '@nestjs/swagger';
import { ObjectID } from 'typeorm';
import {
  IsMongoId,
  IsBoolean,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

import { BaseUserDTO } from './base-user.dto';

export class CreateUserResponseDTO extends BaseUserDTO {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsMongoId()
  id: ObjectID;

  @ApiProperty({
    required: true,
    maxLength: 80,
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(80)
  username: string;

  @ApiProperty({
    default: false,
  })
  @IsBoolean()
  activated: boolean;
}
