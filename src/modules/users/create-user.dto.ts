import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({
    required: true,
    maxLength: 80,
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(80)
  user: string;

  @ApiProperty({
    maxLength: 80,
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  firstName: string;

  @ApiProperty({
    maxLength: 80,
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  lastName: string;

  @ApiProperty({
    maxLength: 80,
    minLength: 5,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: true,
    maxLength: 40,
    minLength: 5,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
