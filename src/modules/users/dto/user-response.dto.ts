import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { BaseUserDTO } from './base-user.dto';
import { ObjectID } from 'typeorm';

// seeding issue
// import { UserRoles } from '../../roles';
export enum UserRoles {
  ADMIN = 'admin',
  MENTOR = 'mentor',
  STUDENT = 'student',
}

export class UserResponseDTO extends BaseUserDTO {
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
    enum: [UserRoles.ADMIN, UserRoles.STUDENT, UserRoles.MENTOR],
  })
  @IsEnum([UserRoles.ADMIN, UserRoles.STUDENT, UserRoles.MENTOR])
  role: string;

  @ApiProperty({
    default: false,
  })
  @IsBoolean()
  activated: boolean;
}
