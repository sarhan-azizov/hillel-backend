import { IsString } from 'class-validator';

export class ReceiveUserDTO {
  @IsString()
  user: string;

  @IsString()
  password: string;
}
