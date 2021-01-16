import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  user: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  password: string;
}
