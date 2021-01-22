import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class AuthorizationRequestDTO {
  @ApiProperty({
    required: true,
    maxLength: 80,
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  @MinLength(3)
  user: string;

  @ApiProperty({
    required: true,
    maxLength: 40,
    minLength: 5,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
