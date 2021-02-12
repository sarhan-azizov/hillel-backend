import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class UserAuthorizationRequestDTO {
  @ApiProperty({
    required: true,
    maxLength: 80,
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  @MinLength(3)
  username: string;

  @ApiProperty({
    required: true,
    maxLength: 40,
    minLength: 5,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
