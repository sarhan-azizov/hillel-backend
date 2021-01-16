import { IsString, IsEmail } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  user: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
