import { CreateUserResponseDTO } from './create-user-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

// seeding issue
// import { UserRoles } from '../../roles';
export enum UserRoles {
  ADMIN = 'admin',
  MENTOR = 'mentor',
  STUDENT = 'student',
}

export class GetUserResponseDTO extends CreateUserResponseDTO {
  constructor() {
    super();
  }

  @ApiProperty({
    enum: [UserRoles.ADMIN, UserRoles.STUDENT, UserRoles.MENTOR],
  })
  @IsEnum([UserRoles.ADMIN, UserRoles.STUDENT, UserRoles.MENTOR])
  role: string;
}
