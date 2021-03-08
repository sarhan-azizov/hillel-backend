import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  token: string;
}
