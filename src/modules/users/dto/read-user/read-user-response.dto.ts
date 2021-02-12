import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ObjectID } from 'typeorm';

// seeding issue
// import { UserRoles } from '../../roles';
export enum UserRoles {
  ADMIN = 'admin',
  MENTOR = 'mentor',
  STUDENT = 'student',
}

export class ReadUserResponseDTO {
  constructor(props) {
    Object.assign(this, {
      id: props._id,
      username: props.username,
      firstName: props.firstName,
      lastName: props.lastName,
      email: props.email,
      role: props.role,
      activated: props.activated,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  @ApiProperty({
    required: true,
    type: String,
  })
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
  @MaxLength(80)
  firstName: string;

  @ApiProperty({
    required: true,
    maxLength: 80,
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  lastName: string;

  @ApiProperty({
    required: true,
    maxLength: 80,
    minLength: 5,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: true,
    enum: [UserRoles.ADMIN, UserRoles.STUDENT, UserRoles.MENTOR],
  })
  @IsEnum([UserRoles.ADMIN, UserRoles.STUDENT, UserRoles.MENTOR])
  role: string;

  @ApiProperty({ required: true, default: false })
  @IsBoolean()
  activated: boolean;

  @ApiProperty({ required: true, type: Date })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ required: true, type: Date })
  @IsDate()
  updatedAt: Date;
}