import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsMongoId } from 'class-validator';

import { BaseUserDTO } from './base-user.dto';
import { ObjectID } from 'typeorm';

// seeding issue
// import { UserRoles } from '../../roles';
export enum UserRoles {
  ADMIN = 'admin',
  MENTOR = 'mentor',
  STUDENT = 'student',
}

export class UpdateUserResponseDTO extends BaseUserDTO {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsMongoId()
  id: ObjectID;

  @ApiProperty({
    enum: [UserRoles.ADMIN, UserRoles.STUDENT, UserRoles.MENTOR],
  })
  @IsEnum([UserRoles.ADMIN, UserRoles.STUDENT, UserRoles.MENTOR])
  role: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  activated: boolean;
}
