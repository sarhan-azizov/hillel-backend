import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsString } from 'class-validator';

import { BaseUserDTO } from './base-user.dto';

// seeding issue
// import { UserRoles } from '../../roles';
export enum UserRoles {
  ADMIN = 'admin',
  MENTOR = 'mentor',
  STUDENT = 'student',
}

export class UpdateUserRequestDTO extends BaseUserDTO {
  @ApiProperty({
    enum: [UserRoles.ADMIN, UserRoles.STUDENT, UserRoles.MENTOR],
  })
  @IsEnum([UserRoles.ADMIN, UserRoles.STUDENT, UserRoles.MENTOR])
  role: string;

  @ApiProperty({
    required: true,
    maxLength: 40,
    minLength: 5,
  })
  @IsString()
  password: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  activated: boolean;
}
