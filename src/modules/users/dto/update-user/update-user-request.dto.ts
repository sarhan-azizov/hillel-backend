import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserRequestDTO {
  @ApiProperty({
    required: false,
    maxLength: 80,
    minLength: 3,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(80)
  firstName: string;

  @ApiProperty({
    required: false,
    maxLength: 80,
    minLength: 3,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(80)
  lastName: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  role: string;

  @ApiProperty({
    required: false,
    maxLength: 80,
    minLength: 5,
  })
  @IsEmail()
  @IsOptional()
  @MinLength(5)
  @MaxLength(80)
  email: string;

  @ApiProperty({ required: false, type: 'boolean' })
  @IsOptional()
  @IsBoolean()
  activated: boolean;

  @ApiProperty({
    required: false,
    maxLength: 80,
    minLength: 5,
  })
  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(80)
  password: string;
}
