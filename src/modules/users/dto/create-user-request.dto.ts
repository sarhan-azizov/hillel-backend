import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

import { BaseUserDTO } from './base-user.dto';

export class CreateUserRequestDTO extends BaseUserDTO {
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
    maxLength: 40,
    minLength: 5,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
