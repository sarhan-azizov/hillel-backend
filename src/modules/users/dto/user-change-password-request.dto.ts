import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsNotEmpty } from 'class-validator';

export class UserChangePasswordRequestDTO {
  @ApiProperty({
    required: true,
    maxLength: 40,
    minLength: 5,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
