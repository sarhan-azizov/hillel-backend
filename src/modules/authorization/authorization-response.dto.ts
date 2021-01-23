import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from '../roles';

export class AuthorizationResponseDTO {
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
    enum: [UserRoles.ADMIN, UserRoles.MENTOR, UserRoles.STUDENT],
  })
  @IsEnum([UserRoles.ADMIN, UserRoles.MENTOR, UserRoles.STUDENT])
  role: string;
}
