import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserRequestDTO {
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
}
