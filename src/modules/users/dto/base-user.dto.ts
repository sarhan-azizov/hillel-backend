import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class BaseUserDTO {
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
}
