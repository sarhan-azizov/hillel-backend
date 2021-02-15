import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class UserChangePasswordRequestDTO {
  @ApiProperty({
    required: true,
    maxLength: 40,
    minLength: 5,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(80)
  password: string;
}
