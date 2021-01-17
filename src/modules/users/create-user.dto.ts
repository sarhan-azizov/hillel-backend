import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  IsMongoId,
} from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  user: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsMongoId()
  role: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
