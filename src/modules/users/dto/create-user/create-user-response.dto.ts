import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ObjectID } from 'typeorm';
import { Type } from 'class-transformer';
import { ReadUserRolesResponseDTO } from '../../../user-roles';

export class CreateUserResponseDTO {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsMongoId()
  _id: ObjectID;

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
    required: true,
    maxLength: 80,
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(80)
  firstName: string;

  @ApiProperty({
    required: true,
  })
  @Type(() => ReadUserRolesResponseDTO)
  role: ReadUserRolesResponseDTO;

  @ApiProperty({
    required: true,
    maxLength: 80,
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(80)
  lastName: string;

  @ApiProperty({
    required: true,
    maxLength: 80,
    minLength: 5,
  })
  @IsEmail()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(80)
  email: string;

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
